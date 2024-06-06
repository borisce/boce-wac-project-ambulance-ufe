import { newSpecPage } from '@stencil/core/testing';
import { BoceWacProjectLogin } from '../boce-wac-project-login';

describe('boce-wac-project-login', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [BoceWacProjectLogin],
      html: `<boce-wac-project-login></boce-wac-project-login>`,
    });
    expect(page.root).toEqualHtml(`
      <boce-wac-project-login>
        <mock:shadow-root>
          <div>
            <h1>Portál pre evidenciu chorôb a vyšetrení</h1>
            <form action="#">
              <div class="form-flex">
                <h2>Prihlásenie</h2>
                <div class="button-flex">
                  <md-elevated-button>
                    Prihlásiť sa ako lekár
                  </md-elevated-button>
                  <md-elevated-button>
                    Prihlásiť sa ako pacient
                  </md-elevated-button>
                </div>
              </div>
            </form>
          </div>
        </mock:shadow-root>
      </boce-wac-project-login>
    `);
  });
});
