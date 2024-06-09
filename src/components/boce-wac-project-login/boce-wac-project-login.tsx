import {State, Component, Host, h, Prop} from '@stencil/core';

@Component({
  tag: 'boce-wac-project-login',
  styleUrl: 'boce-wac-project-login.css',
  shadow: true,
})
export class BoceWacProjectLogin {

  @State() isDoctorLogged: boolean = false;
  @State() isPatientLogged: boolean = false;
  @Prop() apiBase: string;

  private handleDoctorLogin(event: Event) {
    event.preventDefault();
    this.isDoctorLogged = true;
  }

  private handlePatientLogin(event: Event) {
    event.preventDefault();
    this.isPatientLogged = true;
    //comment to trigger flux
  }

  render() {
    if (this.isDoctorLogged) {
      return (
          <boce-wac-project-doctor-patients-list api-base={this.apiBase}></boce-wac-project-doctor-patients-list>
      );
    }

    if (this.isPatientLogged) {
      return (
          <boce-wac-project-my-appointments api-base={this.apiBase}></boce-wac-project-my-appointments>
      );
    }

    return (
      <Host>
            <div>
              <h1>Portál pre evidenciu chorôb a vyšetrení</h1>
              <form action="#">
              <div class="form-flex">
              <h2>Prihlásenie</h2>
                <div class="button-flex">
                  <md-elevated-button onClick={(event) => this.handleDoctorLogin(event)}>Prihlásiť sa ako lekár</md-elevated-button>
                  <md-elevated-button onClick={(event) => this.handlePatientLogin(event)}>Prihlásiť sa ako pacient</md-elevated-button>
                </div>
              </div>
              </form>
            </div>  
      </Host>
    );
  }
}

