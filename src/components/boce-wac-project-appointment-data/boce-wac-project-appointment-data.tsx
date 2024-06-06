import { Component, Host, Prop, h, State } from '@stencil/core';

@Component({
  tag: 'boce-wac-project-appointment-data',
  styleUrl: 'boce-wac-project-appointment-data.css',
  shadow: true,
})
export class BoceWacProjectAppointmentData {
  @Prop() patient: any;
  @State() isEditorClosed: boolean = false;
  @State() isLoggedOut: boolean = false;
  @State() isAppointmentChanged: boolean = false;
  @State() isSaveEnabled: boolean = false;
  @State() doctorNote: string;

  private handleLogout(event: Event) {
    event.preventDefault();
    this.isLoggedOut = true;
  }

  private handleClose(event: Event) {
    event.preventDefault();
    this.isEditorClosed = true;
  }

  private handleSave(event: Event) {
    event.preventDefault();
    this.isAppointmentChanged = true;
  }

  private handleTextareaChange(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    this.doctorNote = textarea.value;
    this.isSaveEnabled = this.doctorNote !== this.patient.doctorNote;
  }

  componentWillLoad() {
    this.doctorNote = this.patient.doctorNote;
  }

  render() {
    if (this.isLoggedOut) {
      return (
        <boce-wac-project-login></boce-wac-project-login>
      );
    }
    if (this.isEditorClosed) {
      return (
        <boce-wac-project-doctor-patients-list></boce-wac-project-doctor-patients-list>
      );
    }
    if (this.isAppointmentChanged) {
      return (
        <boce-wac-project-doctor-patients-list></boce-wac-project-doctor-patients-list>
      );
    }
    return (
      <Host>
        <div class="component-body">
          <header>
            <md-elevated-button onClick={(event) => this.handleLogout(event)}>Odhlásiť sa</md-elevated-button>
          </header>
          <h1>Záznam o vyšetrení</h1>
          <div class="data-flex">
            <div class="patient-flex">
              <p><strong>Meno pacienta:</strong> {this.patient.name}</p>
            </div>
            <p><strong>Termín vyšetrenia:</strong> {this.patient.date.toLocaleDateString('sk-SK')} {this.patient.estimatedStart} - {this.patient.estimatedEnd}</p>
            <p><strong>Dôvod vyšetrenia:</strong> {this.patient.condition}</p>
            <label htmlFor="appointment_data_textarea">Záznam lekára o vykonanom vyšetrení:</label>
            <textarea name="appointment_data" id="appointment_data_textarea" value={this.doctorNote} onInput={(event) => this.handleTextareaChange(event)}></textarea>
          </div>
          <div class="buttons-flex">
            <md-elevated-button onClick={(event) => this.handleClose(event)}>Zrušiť</md-elevated-button>
            <md-elevated-button onClick={(event) => this.handleSave(event)} disabled={!this.isSaveEnabled}>Uložiť</md-elevated-button>
          </div>
        </div>
      </Host>
    );
  }
}
