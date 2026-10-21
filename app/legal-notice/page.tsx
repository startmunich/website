import type { Metadata } from 'next';

import { Prose } from '@/components/ui/prose';
import { Section } from '@/components/ui/section';
import { Heading } from '@/components/ui/typography';
import { OG_IMAGES } from '@/lib/metadata';

export const metadata: Metadata = {
  title: 'Legal Notice',
  description:
    'Legal notice (Impressum) for STARTmunich e.V.: contact details, representatives, registry entry and disclaimer.',
  alternates: { canonical: 'https://www.startmunich.de/legal-notice' },
  openGraph: {
    url: 'https://www.startmunich.de/legal-notice',
    title: 'Legal Notice | START Munich',
    description:
      'Legal notice (Impressum) for STARTmunich e.V.: contact details, representatives, registry entry and disclaimer.',
    images: OG_IMAGES,
  },
};

export default function LegalNoticePage() {
  return (
    <Section container="narrow" spacing="lg">
      <Heading size="h1" className="mb-12">
        Legal Notice
      </Heading>

      <Prose>
        {/* Contact Information */}
        <section>
          <h2>Information in accordance with &sect; 5 DDG</h2>
          <div>
            <p>STARTmunich e.V.</p>
            <p>Arcisstrasse 21</p>
            <p>80333 Munich</p>
            <p>
              <a href="mailto:info@startmunich.de">info@startmunich.de</a>
            </p>
          </div>
        </section>

        {/* Representatives */}
        <section>
          <h3>Represented by</h3>
          <div>
            <p>Niklas Dr&ouml;ssler</p>
            <p>Eva Feische</p>
            <p>Moritz Gubitzer</p>
          </div>
        </section>

        {/* Registry Entry */}
        <section>
          <h3>Registry Entry</h3>
          <div>
            <p>Entry in Vereinsregister.</p>
            <p>Register court: M&uuml;nchen</p>
            <p>Register number: 18536</p>
          </div>
        </section>

        {/* Disclaimer */}
        <section>
          <h2>Disclaimer</h2>

          <div>
            <div>
              <h3>Liability for Content</h3>
              <p>
                The content of our pages was created with the utmost care. However, we cannot
                guarantee the correctness, completeness, or topicality of the content. According to
                &sect; 7 (1) DDG, as a service provider, we are responsible for our own content on
                these pages in accordance with general laws. According to &sect; 7 DDG and Article 8
                of the Digital Services Act (DSA), however, we are not obliged to monitor
                transmitted or stored third-party information or to investigate circumstances that
                indicate illegal activity. Obligations to remove or block the use of information in
                accordance with general laws remain unaffected. However, liability in this respect
                is only possible from the time of knowledge of a concrete violation of the law. As
                soon as we become aware of such infringements, we will remove this content
                immediately.
              </p>
            </div>

            <div>
              <h3>Liability for Links</h3>
              <p>
                Our website contains links to third-party websites over whose content we have no
                control. Therefore, we cannot take any responsibility for those external contents.
                The respective provider or operator of the websites is always responsible for its
                content. The linked websites were checked for possible legal infringements at the
                time of the linking. Illegal contents were not identifiable at the time of the
                linking. However, a permanent control of the content of the linked websites is not
                reasonable without concrete evidence of an infringement. We will remove such links
                immediately upon becoming aware of any violations of the law.
              </p>
            </div>

            <div>
              <h3>Copyright</h3>
              <p>
                The content and works on this website created by the site operators are subject to
                German copyright law. Duplication, processing, distribution and any form of
                commercialization of such material beyond the scope of the copyright law shall
                require the prior written consent of its respective author or creator. Downloads and
                copies of this website is only permitted for private, non-commercial use. Insofar as
                the content on this website was not created by the operator, the copyrights of third
                parties are respected. In particular, contents of third parties are marked as such.
                Should you nonetheless become aware of a copyright infringement, please inform us
                about it. As soon as we become aware of any infringements of the law, we will remove
                such content immediately.
              </p>
            </div>

            <div>
              <h3>Privacy</h3>
              <p>
                The use of our website is generally possible without providing personal data. If
                personal data (e.g. name, address or e-mail address) is collected on our website,
                this is always done on a voluntary basis to the extent it is possible. This data
                will not be passed on to third parties without your explicit consent. We would like
                to point out that data transmission over the Internet (e.g. communication by e-mail)
                can be subject to security vulnerabilities. A complete protection of the data
                against access by third parties is not possible. The use of published postal
                addresses, telephone or fax numbers and email addresses for marketing purposes is
                prohibited. The operators of this website explicitly reserve the right to take legal
                action against unsolicited mailing or e-mailing of spam and other similar
                advertising materials.
              </p>
            </div>
          </div>
        </section>
      </Prose>
    </Section>
  );
}
