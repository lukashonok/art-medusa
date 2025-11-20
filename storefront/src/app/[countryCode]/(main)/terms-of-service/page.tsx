import { Metadata } from "next"
import { Heading } from "@medusajs/ui"

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Our terms of service.",
}

export default function TermsOfService() {
  return (
    <div className="pt-16">
      <div className="content-container py-12">
        <Heading level="h1" className="text-4xl text-center mb-12">
          Terms of Service
        </Heading>
        <div className="prose prose-lg mx-auto">
          <p>
            These Terms of Service ("Terms") govern your access to and use of
            the services, including our website, applications, and other online
            products and services (collectively, the "Services") provided by
            Your Store Name ("we," "us," or "our"). By accessing or using our
            Services, you agree to be bound by these Terms and by our Privacy
            Policy.
          </p>

          <h2>1. Acceptance of Terms</h2>
          <p>
            By using our Services, you confirm that you have read, understood,
            and agree to be bound by these Terms. If you do not agree with all
            of these Terms, then you are expressly prohibited from using the
            Services and you must discontinue use immediately.
          </p>

          <h2>2. Changes to Terms</h2>
          <p>
            We reserve the right, in our sole discretion, to make changes or
            modifications to these Terms at any time and for any reason. We will
            alert you about any changes by updating the "Last updated" date of
            these Terms, and you waive any right to receive specific notice of
            each such change. It is your responsibility to periodically review
            these Terms to stay informed of updates. You will be subject to, and
            will be deemed to have been made aware of and to have accepted, the
            changes in any revised Terms by your continued use of the Services
            after the date such revised Terms are posted.
          </p>

          <h2>3. User Registration</h2>
          <p>
            You may be required to register with the Services. You agree to keep
            your password confidential and will be responsible for all use of
            your account and password. We reserve the right to remove, reclaim,
            or change a username you select if we determine, in our sole
            discretion, that such username is inappropriate, obscene, or
            otherwise objectionable.
          </p>

          <h2>4. Products</h2>
          <p>
            All products are subject to availability. We reserve the right to
            discontinue any products at any time for any reason. Prices for all
            products are subject to change.
          </p>

          <h2>5. Purchases and Payment</h2>
          <p>
            We accept the following forms of payment: [List accepted payment
            methods, e.g., Visa, Mastercard, American Express, PayPal]. You
            agree to provide current, complete, and accurate purchase and
            account information for all purchases made via the Services. You
            further agree to promptly update account and payment information,
            including email address, payment method, and payment card expiration
            date, so that we can complete your transactions and contact you as
            needed. Sales tax will be added to the price of purchases as deemed
            required by us. We may change prices at any time. All payments shall
            be in [Your Currency, e.g., USD].
          </p>

          <h2>6. Returns/Refunds Policy</h2>
          <p>
            Please review our Return Policy posted on the Services prior to
            making any purchases.
          </p>

          <h2>7. Prohibited Activities</h2>
          <p>
            You may not access or use the Services for any purpose other than
            that for which we make the Services available. The Services may not
            be used in connection with any commercial endeavors except those
            that are specifically endorsed or approved by us.
          </p>

          <h2>8. Termination</h2>
          <p>
            We may terminate or suspend your access to our Services immediately,
            without prior notice or liability, for any reason whatsoever,
            including without limitation if you breach the Terms.
          </p>

          <h2>9. Governing Law</h2>
          <p>
            These Terms shall be governed and construed in accordance with the
            laws of [Your State/Country], without regard to its conflict of law
            provisions.
          </p>

          <h2>10. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at
            [Your Contact Email].
          </p>
        </div>
      </div>
    </div>
  )
}
