import { Scenario, ScenarioResult } from '../../Scenario';
import { InvalidProductIdErrorValidator } from '../../../../../validators/backendValidator/Error/InvalidProductIdErrorValidator';
import { BookingReservationScenarioHelper } from '../../../helpers/BookingReservationScenarioHelper';
import { Booking } from '@octocloud/types';
import { Result } from '../../../api/types';
import descriptions from '../../../consts/descriptions';

export class BookingReservationInvalidProductScenario implements Scenario {
  private readonly result: Result<Booking>;
  public constructor({ result }: { result: Result<Booking> }) {
    this.result = result;
  }

  private readonly bookingReservationScenarioHelper = new BookingReservationScenarioHelper();

  public validate = async (): Promise<ScenarioResult> => {
    const name = 'Booking Reservation Invalid Product (400 INVALID_PRODUCT_ID)';
    const description = descriptions.invalidProduct;

    return this.bookingReservationScenarioHelper.validateError(
      {
        result: this.result,
        name,
        description,
      },
      new InvalidProductIdErrorValidator(),
    );
  };
}
