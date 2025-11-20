import { Metadata } from "next"
import { Heading } from "@medusajs/ui"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Our privacy policy.",
}

export default function PrivacyPolicy() {
  return (
    <div className="pt-16">
      <div className="content-container py-12">
        <Heading level="h1" className="text-4xl text-center mb-12">
          Privacy Policy
        </Heading>
        <div className="prose prose-lg mx-auto">
          <p>
            This Privacy Policy describes how Your Store Name (the "Site", "we",
            "us", or "our") collects, uses, and discloses your personal
            information when you visit, use our services, or make a purchase
            from yourstore.com (the "Site") or otherwise communicate with us
            (collectively, the "Services").
          </p>
          <p>
            For the purposes of this Privacy Policy, "you" and "your" refers to
            you as the user of the Services, whether you are a customer, website
            visitor, or another individual whose information we have collected
            pursuant to this Privacy Policy.
          </p>
          <p>
            Please read this Privacy Policy carefully. By using and accessing
            any of the Services, you agree to the collection, use, and
            disclosure of your information as described in this Privacy Policy.
            If you do not agree to this Privacy Policy, please do not use or
            access any of the Services.
          </p>

          <h2>Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time, including to
            reflect changes to our practices or for other operational, legal, or
            regulatory reasons. We will post the revised Privacy Policy on the
            Site, update the "Last updated" date and take any other steps
            required by applicable law.
          </p>

          <h2>How We Collect and Use Your Personal Information</h2>
          <p>
            To provide the Services, we collect and have collected over the past
            12 months personal information about you from a variety of sources,
            as set out below. The information that we collect and use varies
            depending on how you interact with us.
          </p>
          <p>
            In addition to the specific uses set out below, we may use
            information we collect about you to communicate with you, to provide
            the Services, to comply with any applicable legal obligations, to
            enforce any applicable terms of service, and to protect or defend
            the Services, our rights, and the rights of our users or others.
          </p>

          <h3>What Personal Information We Collect</h3>
          <p>
            The types of personal information we obtain about you depends on how
            you interact with our Site and use our Services. When we use the
            term "personal information", we are referring to information that
            identifies, relates to, describes or can be associated with you. The
            following sections describe the categories of personal information
            we collect and the specific types of personal information within
            each category.
          </p>

          <h4>Information you submit to us directly</h4>
          <p>
            Information that you directly submit to us through our Services may
            include:
          </p>
          <ul>
            <li>
              Basic contact details including your name, address, phone number,
              email.
            </li>
            <li>Order information including your name, billing address,
              shipping address, payment confirmation, email address, phone
              number.</li>
            <li>Account information including your username, password, security
              questions.</li>
            <li>Shopping information including the items you view, put in your
              cart or add to your wishlist.</li>
            <li>Customer support information including the communications you
              exchange with us, for example, when you send a message through the
              Services.</li>
          </ul>
          <p>
            Some features of the Services may require you to directly provide
            us with certain information about yourself. You may elect not to
            provide this information, but doing so may prevent you from using or
            accessing these features.
          </p>

          <h4>Information we collect through Cookies</h4>
          <p>
            We also automatically collect certain information about your
            interaction with the Services ("Usage Data"). To do this, we may use
            cookies, pixels, and similar technologies ("Cookies"). Usage Data
            may include information about how you access and use our Site and
            your account, including device information, browser information,
            information about your network connection, your IP address, and
            other information regarding your interaction with the Services.
          </p>

          <h4>Information we obtain from third parties</h4>
          <p>
            Finally, we may obtain information about you from third parties,
            including from vendors and service providers who may collect
            information on our behalf, such as:
          </p>
          <ul>
            <li>Companies that support our Site and Services, such as payment
              processors and shipping companies.</li>
            <li>When you visit our Site or open or click on emails we send you,
              we may collect information about your usage of the Services.</li>
          </ul>
          <p>
            Any information we obtain from third parties will be treated in
            accordance with this Privacy Policy.
          </p>

          <h2>How We Disclose Personal Information</h2>
          <p>
            In certain circumstances, we may disclose your personal information
            to third parties for legitimate purposes subject to this Privacy
            Policy. Such circumstances may include:
          </p>
          <ul>
            <li>With vendors and other third parties who perform services on our
              behalf (e.g., IT management, payment processing, data analytics,
              customer support, cloud storage, fulfillment and shipping).</li>
            <li>With business partners who provide services or products that may
              be of interest to you.</li>
            <li>When you direct, request, or otherwise consent to our disclosure
              of certain information to third parties, such as to ship products
              or through your use of social media widgets or login integrations.</li>
            <li>With our affiliates or otherwise within our corporate group, for
              legitimate business interests.</li>
            <li>In connection with a business transaction such as a merger or
              bankruptcy, to comply with applicable legal obligations (including
              to respond to subpoenas, warrants, and court orders), to enforce
              any applicable terms of service, and to protect or defend the
              Services, our rights, and the rights of our users or others.</li>
          </ul>
          <p>
            We have, in the past 12 months, disclosed the following categories
            of personal information and sensitive personal information (with
            respect to the definitions of such terms under applicable law) to
            third parties for the purposes of providing the Services and our
            Site:
          </p>
          <ul>
            <li>Identifiers such as basic contact details and order information</li>
            <li>Commercial information such as shopping information</li>
            <li>Internet or other similar network activity, such as Usage Data</li>
          </ul>
          <p>
            We do not use or disclose sensitive personal information for the
            purposes of inferring characteristics about you.
          </p>

          <h2>Your Rights and Choices</h2>
          <p>
            Depending on where you are located, you may have some or all of the
            following rights in relation to your personal information:
          </p>
          <ul>
            <li>Right to Access/Know</li>
            <li>Right to Delete</li>
            <li>Right to Correct</li>
            <li>Right to Portability</li>
            <li>Right to Opt-Out of Sale or Sharing</li>
            <li>Right to Limit Use and Disclosure of Sensitive Personal
              Information</li>
          </ul>
          <p>
            You may exercise any of these rights where indicated on our Site or
            by contacting us using the contact details provided below.
          </p>

          <h2>Contact</h2>
          <p>
            Should you have any questions about our privacy practices or this
            Privacy Policy, or if you would like to exercise any of the rights
            available to you, please contact us at [Your Contact Email].
          </p>
        </div>
      </div>
    </div>
  )
}
