interface PolicyPageProps {
  title: string
  updated?: string
  sections: { heading: string; body: string[] }[]
}

export function PolicyPage({
  title,
  updated = 'October 2026 (placeholder)',
  sections,
}: PolicyPageProps) {
  return (
    <div className="container-je py-10 md:py-16">
      <p className="text-xs uppercase tracking-[0.2em] text-mute">Policy</p>
      <h1 className="mt-3 max-w-3xl font-display text-4xl font-bold tracking-tight md:text-5xl">
        {title}
      </h1>
      <p className="mt-4 text-sm text-mute">Last updated: {updated}</p>
      <div className="mx-auto mt-12 max-w-3xl space-y-10">
        {sections.map((section) => (
          <section key={section.heading}>
            <h2 className="font-display text-2xl font-semibold">
              {section.heading}
            </h2>
            {section.body.map((paragraph) => (
              <p
                key={paragraph}
                className="mt-4 text-sm leading-relaxed text-mute md:text-base"
              >
                {paragraph}
              </p>
            ))}
          </section>
        ))}
      </div>
    </div>
  )
}

export function ShippingPage() {
  return (
    <PolicyPage
      title="Shipping and Delivery Policy"
      sections={[
        {
          heading: 'Overview',
          body: [
            'Shipping regions, carriers, and rates are placeholders until JUST EIGHT confirms fulfillment details.',
            'Demo orders placed on this site are not fulfilled.',
          ],
        },
        {
          heading: 'Processing time',
          body: [
            'Expected order processing windows will be published here once warehouse operations are set.',
          ],
        },
        {
          heading: 'Delivery estimates',
          body: [
            'Domestic and international delivery estimates should replace this text before launch.',
          ],
        },
        {
          heading: 'Duties and taxes',
          body: [
            'International customers may be responsible for customs duties depending on destination. Confirm local rules before publishing final language.',
          ],
        },
      ]}
    />
  )
}

export function ReturnsPage() {
  return (
    <PolicyPage
      title="Returns and Refunds Policy"
      sections={[
        {
          heading: 'Return window',
          body: [
            'Define your return window (for example 14 or 30 days) and item condition requirements before launch.',
          ],
        },
        {
          heading: 'Eligibility',
          body: [
            'Unworn items with original tags are typically eligible. Final rules for sale items, underwear, and accessories should be confirmed by the brand.',
          ],
        },
        {
          heading: 'Refunds',
          body: [
            'Refund method and timeline placeholders: refunds are usually issued to the original payment method after inspection.',
          ],
        },
        {
          heading: 'Exchanges',
          body: [
            'Exchange availability depends on stock. This section should be updated when inventory systems are connected.',
          ],
        },
      ]}
    />
  )
}

export function PrivacyPage() {
  return (
    <PolicyPage
      title="Privacy Policy"
      sections={[
        {
          heading: 'Information we collect',
          body: [
            'When the store goes live, JUST EIGHT may collect contact details, shipping information, and order history needed to fulfill purchases.',
            'This demo site stores cart and demo order data in your browser only.',
          ],
        },
        {
          heading: 'How we use information',
          body: [
            'Customer data will be used to process orders, provide support, and (with consent) send marketing updates.',
          ],
        },
        {
          heading: 'Sharing',
          body: [
            'Payment processors, shipping carriers, and analytics tools may receive necessary data. List actual vendors here before launch.',
          ],
        },
        {
          heading: 'Your rights',
          body: [
            'Depending on your location, you may request access, correction, or deletion of personal data. Contact details for privacy requests should be confirmed.',
          ],
        },
      ]}
    />
  )
}

export function TermsPage() {
  return (
    <PolicyPage
      title="Terms and Conditions"
      sections={[
        {
          heading: 'Agreement',
          body: [
            'By using the JUST EIGHT website you agree to these terms. Replace this placeholder with counsel-reviewed terms before accepting real orders.',
          ],
        },
        {
          heading: 'Products and pricing',
          body: [
            'Product images, descriptions, and prices on this demo site are illustrative and may change.',
          ],
        },
        {
          heading: 'Orders',
          body: [
            'Demo checkout does not create a binding purchase. Live orders will be subject to acceptance, stock availability, and payment confirmation.',
          ],
        },
        {
          heading: 'Intellectual property',
          body: [
            'JUST EIGHT name, visuals, and site content are reserved for the brand. Unauthorized use is prohibited.',
          ],
        },
      ]}
    />
  )
}
