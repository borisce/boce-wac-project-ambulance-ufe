import { newE2EPage } from '@stencil/core/testing';

describe('boce-wac-project-login', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<boce-wac-project-login></boce-wac-project-login>');

    const element = await page.find('boce-wac-project-login');
    expect(element).toHaveClass('hydrated');
  });
});
