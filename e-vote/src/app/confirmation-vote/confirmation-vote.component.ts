import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirmation-vote',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirmation-vote.component.html',
  styleUrls: ['./confirmation-vote.component.css']
})
export class ConfirmationVoteComponent {
  @Input() c: any; // ✅ Permet de recevoir le candidat sélectionné
}
