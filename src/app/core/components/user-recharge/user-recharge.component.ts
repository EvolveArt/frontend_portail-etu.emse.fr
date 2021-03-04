import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl, AbstractControl } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { NewOperation, Operation } from '../../models/operation.model';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { OperationService } from '../../services/operation.service';
import { InfoService } from '../../services/info.service';
import { AuthenticatedUser } from '../../models/auth.model';
import { PaymentMeansService } from '../../services/payment-means.service';
import { PaymentMeans } from '../../models/payment-means.model';

@Component({
  selector: 'app-user-recharge',
  templateUrl: './user-recharge.component.html',
  styleUrls: ['./user-recharge.component.scss']
})
export class UserRechargeComponent implements OnInit {

  @Output() submitted = new EventEmitter<NewOperation>();
  apiUrl = environment.apiUri;

  form: FormGroup = this.fb.group({
    type: ['recharge'],
    paymentMeans: ['', Validators.required],
    user: [''],
    reason: ['Rechargement'],
    amount: [0],
  });

  _user: User;
  authenticatedUser: AuthenticatedUser;

  loading: boolean = false;

  paymentMeans : PaymentMeans[];

  get amount() {
    return this.form.get('amount');
  }

  get user() {
    return this.form.get('user');
  }

  constructor(private paymentMeansService: PaymentMeansService,private infoService : InfoService, private authService: AuthService, private fb: FormBuilder, private userService: UserService, private operationService: OperationService) { }

  ngOnInit() {
    this.authService.authenticatedUser.subscribe(authenticatedUser => {
      // console.log(authenticatedUser);
      if (authenticatedUser && (!this._user || authenticatedUser.id !== this._user.id)) {
        this.userService.getInfo();
        this.authenticatedUser = authenticatedUser;
      }
    });
    this.userService.user.subscribe(user => {
      this._user = user;
      this.user.setValue({user: user});
    });
    this.authService.refresh();

    this.paymentMeansService.gets().subscribe((paymentMeans: PaymentMeans[]) => {
      this.paymentMeans = paymentMeans;
      const lydiaPayment = paymentMeans.find((paymentMean) => paymentMean.name === "Lydia");
      this.form.get('paymentMeans').setValue(this.apiUrl + '/payment_means/' + lydiaPayment.id);
    });
  }

  submit() {
    if (this.form.valid) {
      //Lydia API request

      // Update user's balance upon success
    //   this.user.setValue(`${this.apiUrl}/users/${this._user.id}`);
    //   const operation : NewOperation = this.form.value;
    //   this.loading = true;
    // this.operationService.create(operation).subscribe(
    //   () => {
    //     this.loading = false;
    //     this.infoService.pushSuccess('Operation effectuée');
    //     const user = operation.user.split('/');
    //     // this._user.balance += operation.amount;
    //   },
    //   () => {
    //     this.loading = false;
    //   },
    // );
    }
  }

  getErrorMessage(formControl: FormControl | AbstractControl) {
    // eslint-disable-next-line no-nested-ternary
    return formControl.hasError('required')
      ? 'Ce champs ne doit pas être vide'
      : formControl.hasError('accountToLow')
      ? "Le compte BDE ne contient pas assez d'argent"
      : '';
  }

}
