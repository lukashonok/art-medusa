import { CreateInventoryLevelInput, ExecArgs } from "@medusajs/framework/types";
import {
  ContainerRegistrationKeys,
  Modules,
  ProductStatus,
} from "@medusajs/framework/utils";
import {
  createApiKeysWorkflow,
  createInventoryLevelsWorkflow,
  createProductCategoriesWorkflow,
  createProductsWorkflow,
  createRegionsWorkflow,
  createSalesChannelsWorkflow,
  createShippingOptionsWorkflow,
  createShippingProfilesWorkflow,
  createStockLocationsWorkflow,
  createTaxRegionsWorkflow,
  linkSalesChannelsToApiKeyWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
  updateStoresStep,
  updateStoresWorkflow,
} from "@medusajs/medusa/core-flows";
import {
  createWorkflow,
  transform,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";

const updateStoreCurrencies = createWorkflow(
  "update-store-currencies",
  (input: {
    supported_currencies: { currency_code: string; is_default?: boolean }[];
    store_id: string;
  }) => {
    const normalizedInput = transform({ input }, (data) => {
      return {
        selector: { id: data.input.store_id },
        update: {
          supported_currencies: data.input.supported_currencies.map(
            (currency) => {
              return {
                currency_code: currency.currency_code,
                is_default: currency.is_default ?? false,
              };
            }
          ),
        },
      };
    });

    const stores = updateStoresStep(normalizedInput);

    return new WorkflowResponse(stores);
  }
);

export default async function seedDemoData({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const link = container.resolve(ContainerRegistrationKeys.LINK);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT);
  const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL);
  const storeModuleService = container.resolve(Modules.STORE);

  const europeCountries = ["de", "it", "gb", "fr", "dk"];
  const usCountries = ["us"];
  const plCountries = ["pl"];
  const allCountries = [...europeCountries, ...usCountries, ...plCountries];

  logger.info("Seeding store data...");
  const [store] = await storeModuleService.listStores();
  let defaultSalesChannel = await salesChannelModuleService.listSalesChannels({
    name: "Default Sales Channel",
  });

  if (!defaultSalesChannel.length) {
    // create the default sales channel
    const { result: salesChannelResult } = await createSalesChannelsWorkflow(
      container
    ).run({
      input: {
        salesChannelsData: [
          {
            name: "Default Sales Channel",
          },
        ],
      },
    });
    defaultSalesChannel = salesChannelResult;
  }

  await updateStoreCurrencies(container).run({
    input: {
      store_id: store.id,
      supported_currencies: [
        {
          currency_code: "eur",
          is_default: true,
        },
        {
          currency_code: "usd",
        },
        {
          currency_code: "pln",
        },
      ],
    },
  });

  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: {
        default_sales_channel_id: defaultSalesChannel[0].id,
      },
    },
  });
  logger.info("Seeding region data...");
  await createRegionsWorkflow(container).run({
    input: {
      regions: [
        {
          name: "Europe",
          currency_code: "eur",
          countries: europeCountries,
          payment_providers: ["pp_system_default"],
        },
        {
          name: "US",
          currency_code: "usd",
          countries: usCountries,
          payment_providers: ["pp_system_default"],
        },
        {
          name: "PL",
          currency_code: "pln",
          countries: plCountries,
          payment_providers: ["pp_system_default"],
        },
      ],
    },
  });
  logger.info("Finished seeding regions.");

  logger.info("Seeding tax regions...");
  await createTaxRegionsWorkflow(container).run({
    input: allCountries.map((country_code) => ({
      country_code,
      provider_id: "tp_system",
    })),
  });
  logger.info("Finished seeding tax regions.");

  logger.info("Seeding stock location data...");
  const { result: stockLocationResult } = await createStockLocationsWorkflow(
    container
  ).run({
    input: {
      locations: [
        {
          name: "Art House Europe",
          address: {
            city: "Berlin",
            country_code: "DE",
            address_1: "Kunststrasse 1",
          },
        },
        {
          name: "Art House US",
          address: {
            city: "New York",
            country_code: "US",
            address_1: "1 Art Plaza",
          },
        },
        {
          name: "Art House PL",
          address: {
            city: "Warsaw",
            country_code: "PL",
            address_1: "Artystyczna 1",
          },
        },
      ],
    },
  });
  const europeanStockLocation = stockLocationResult.find(
    (sl) => sl.name === "Art House Europe"
  )!;

  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: {
        default_location_id: europeanStockLocation.id,
      },
    },
  });

  for (const stockLocation of stockLocationResult) {
    await link.create({
      [Modules.STOCK_LOCATION]: {
        stock_location_id: stockLocation.id,
      },
      [Modules.FULFILLMENT]: {
        fulfillment_provider_id: "manual_manual",
      },
    });
  }

  logger.info("Seeding fulfillment data...");
  const shippingProfiles = await fulfillmentModuleService.listShippingProfiles({
    type: "default",
  });
  let shippingProfile = shippingProfiles.length ? shippingProfiles[0] : null;

  if (!shippingProfile) {
    const { result: shippingProfileResult } =
      await createShippingProfilesWorkflow(container).run({
        input: {
          data: [
            {
              name: "Default Shipping Profile",
              type: "default",
            },
          ],
        },
      });
    shippingProfile = shippingProfileResult[0];
  }

  const fulfillmentSetEurope = await fulfillmentModuleService.createFulfillmentSets({
    name: "Europe Delivery",
    type: "shipping",
    service_zones: [
      {
        name: "Europe",
        geo_zones: europeCountries.map((code) => ({
          country_code: code,
          type: "country",
        })),
      },
    ],
  });

  const fulfillmentSetUS = await fulfillmentModuleService.createFulfillmentSets({
    name: "US Delivery",
    type: "shipping",
    service_zones: [
      {
        name: "US",
        geo_zones: usCountries.map((code) => ({
          country_code: code,
          type: "country",
        })),
      },
    ],
  });

  const fulfillmentSetPL = await fulfillmentModuleService.createFulfillmentSets({
    name: "PL Delivery",
    type: "shipping",
    service_zones: [
      {
        name: "PL",
        geo_zones: plCountries.map((code) => ({
          country_code: code,
          type: "country",
        })),
      },
    ],
  });

  const fulfillmentSets = [
    fulfillmentSetEurope,
    fulfillmentSetUS,
    fulfillmentSetPL,
  ];

  await link.create([
    {
      [Modules.STOCK_LOCATION]: {
        stock_location_id: stockLocationResult.find(
          (sl) => sl.name === "Art House Europe"
        )!.id,
      },
      [Modules.FULFILLMENT]: {
        fulfillment_set_id: fulfillmentSetEurope.id,
      },
    },
    {
      [Modules.STOCK_LOCATION]: {
        stock_location_id: stockLocationResult.find(
          (sl) => sl.name === "Art House US"
        )!.id,
      },
      [Modules.FULFILLMENT]: {
        fulfillment_set_id: fulfillmentSetUS.id,
      },
    },
    {
      [Modules.STOCK_LOCATION]: {
        stock_location_id: stockLocationResult.find(
          (sl) => sl.name === "Art House PL"
        )!.id,
      },
      [Modules.FULFILLMENT]: {
        fulfillment_set_id: fulfillmentSetPL.id,
      },
    },
  ]);

  const shippingOptionsInput = fulfillmentSets
    .map((fulfillmentSet) => {
      return [
        {
          name: "Standard Delivery",
          price_type: "flat",
          provider_id: "manual_manual",
          service_zone_id: fulfillmentSet.service_zones[0].id,
          shipping_profile_id: shippingProfile!.id,
          type: {
            label: "Standard",
            description: "Free standard delivery.",
            code: "standard",
          },
          prices: [
            { currency_code: "eur", amount: 0 },
            { currency_code: "usd", amount: 0 },
            { currency_code: "pln", amount: 0 },
          ],
          rules: [
            { attribute: "enabled_in_store", value: "true", operator: "eq" },
            { attribute: "is_return", value: "false", operator: "eq" },
          ],
        },
        {
          name: "Self-pickup",
          price_type: "flat",
          provider_id: "manual_manual",
          service_zone_id: fulfillmentSet.service_zones[0].id,
          shipping_profile_id: shippingProfile!.id,
          type: {
            label: "Self-pickup",
            description: "Pick up your order at our location.",
            code: "self-pickup",
          },
          prices: [
            { currency_code: "eur", amount: 0 },
            { currency_code: "usd", amount: 0 },
            { currency_code: "pln", amount: 0 },
          ],
          rules: [
            { attribute: "enabled_in_store", value: "true", operator: "eq" },
            { attribute: "is_return", value: "false", operator: "eq" },
          ],
        },
      ];
    })
    .flat();

  await createShippingOptionsWorkflow(container).run({
    input: shippingOptionsInput,
  });
  logger.info("Finished seeding fulfillment data.");

  for (const stockLocation of stockLocationResult) {
    await linkSalesChannelsToStockLocationWorkflow(container).run({
      input: {
        id: stockLocation.id,
        add: [defaultSalesChannel[0].id],
      },
    });
  }
  logger.info("Finished seeding stock location data.");

  logger.info("Seeding publishable API key data...");
  const { result: publishableApiKeyResult } = await createApiKeysWorkflow(
    container
  ).run({
    input: {
      api_keys: [
        {
          title: "Webshop",
          type: "publishable",
          created_by: "",
        },
      ],
    },
  });
  const publishableApiKey = publishableApiKeyResult[0];

  await linkSalesChannelsToApiKeyWorkflow(container).run({
    input: {
      id: publishableApiKey.id,
      add: [defaultSalesChannel[0].id],
    },
  });
  logger.info("Finished seeding publishable API key data.");

  logger.info("Seeding product data...");

  const { result: categoryResult } = await createProductCategoriesWorkflow(
    container
  ).run({
    input: {
      product_categories: [
        {
          name: "Interior design",
          is_active: true,
        },
        {
          name: "Photos",
          is_active: true,
        },
      ],
    },
  });

  await createProductsWorkflow(container).run({
    input: {
      products: [
        {
          title: "Abstract Canvas Art 'Colors of Life'",
          category_ids: [
            categoryResult.find((cat) => cat.name === "Interior design")!.id,
          ],
          description:
            "A vibrant and colorful abstract painting on canvas. Perfect to bring life to any room.",
          handle: "abstract-canvas-art-colors-of-life",
          weight: 1500,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile!.id,
          images: [
            {
              url: "https://m.media-amazon.com/images/I/8148UrepONL._AC_SX679_.jpg",
            },
          ],
          options: [
            {
              title: "Size",
              values: ["One Size"],
            },
          ],
          variants: [
            {
              title: "One Size",
              sku: "ART-ABSTRACT-01",
              options: {
                Size: "One Size",
              },
              prices: [
                { amount: 250, currency_code: "eur" },
                { amount: 275, currency_code: "usd" },
                { amount: 1100, currency_code: "pln" },
              ],
            },
          ],
          sales_channels: [
            {
              id: defaultSalesChannel[0].id,
            },
          ],
        },
        {
          title: "Modern Metal Sculpture 'The Thinker'",
          category_ids: [
            categoryResult.find((cat) => cat.name === "Interior design")!.id,
          ],
          description:
            "A modern interpretation of a classic sculpture, crafted from polished metal.",
          handle: "modern-metal-sculpture-the-thinker",
          weight: 5000,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile!.id,
          images: [
            {
              url: "https://api.nga.gov/iiif/a709486d-3e3a-4491-bf9e-59d3c4f37fb7/full/!800,800/0/default.jpg",
            },
          ],
          options: [
            {
              title: "Size",
              values: ["One Size"],
            },
          ],
          variants: [
            {
              title: "One Size",
              sku: "ART-SCULPTURE-01",
              options: {
                Size: "One Size",
              },
              prices: [
                { amount: 450, currency_code: "eur" },
                { amount: 500, currency_code: "usd" },
                { amount: 2000, currency_code: "pln" },
              ],
            },
          ],
          sales_channels: [
            {
              id: defaultSalesChannel[0].id,
            },
          ],
        },
        {
          title: "Black and White Photo 'Urban Silence'",
          category_ids: [
            categoryResult.find((cat) => cat.name === "Photos")!.id,
          ],
          description:
            "A stunning black and white photograph capturing a moment of silence in a bustling city.",
          handle: "bw-photo-urban-silence",
          weight: 500,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile!.id,
          images: [
            {
              url: "https://media.printler.com/media/photo/350948.jpg",
            },
          ],
          options: [
            {
              title: "Size",
              values: ["One Size"],
            },
          ],
          variants: [
            {
              title: "One Size",
              sku: "PHOTO-BW-01",
              options: {
                Size: "One Size",
              },
              prices: [
                { amount: 120, currency_code: "eur" },
                { amount: 130, currency_code: "usd" },
                { amount: 520, currency_code: "pln" },
              ],
            },
          ],
          sales_channels: [
            {
              id: defaultSalesChannel[0].id,
            },
          ],
        },
        {
          title: "Nature Photo 'Misty Mountains'",
          category_ids: [
            categoryResult.find((cat) => cat.name === "Photos")!.id,
          ],
          description:
            "A breathtaking photograph of mountains shrouded in mist at sunrise.",
          handle: "nature-photo-misty-mountains",
          weight: 500,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile!.id,
          images: [
            {
              url: "https://images.stockcake.com/public/f/f/a/ffa4d173-c203-49ee-82c4-12879616129d_large/misty-mountain-peaks-stockcake.jpg",
            },
          ],
          options: [
            {
              title: "Size",
              values: ["One Size"],
            },
          ],
          variants: [
            {
              title: "One Size",
              sku: "PHOTO-NATURE-01",
              options: {
                Size: "One Size",
              },
              prices: [
                { amount: 120, currency_code: "eur" },
                { amount: 130, currency_code: "usd" },
                { amount: 520, currency_code: "pln" },
              ],
            },
          ],
          sales_channels: [
            {
              id: defaultSalesChannel[0].id,
            },
          ],
        },
      ],
    },
  });
  logger.info("Finished seeding product data.");

  logger.info("Seeding inventory levels.");

  const { data: inventoryItems } = await query.graph({
    entity: "inventory_item",
    fields: ["id"],
  });

  const inventoryLevels: CreateInventoryLevelInput[] = [];
  for (const stockLocation of stockLocationResult) {
    for (const inventoryItem of inventoryItems) {
      const inventoryLevel = {
        location_id: stockLocation.id,
        stocked_quantity: 1, // Changed to 1 as per user request
        inventory_item_id: inventoryItem.id,
      };
      inventoryLevels.push(inventoryLevel);
    }
  }

  await createInventoryLevelsWorkflow(container).run({
    input: {
      inventory_levels: inventoryLevels,
    },
  });

  logger.info("Finished seeding inventory levels data.");
}
