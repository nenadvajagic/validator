import { Booking } from '@octocloud/types';
import { CommonValidator } from '../../CommonValidator';
import { ModelValidator, NullValidator, StringValidator, ValidatorError } from '../../ValidatorHelpers';

export class BookingStateCancelledValidator implements ModelValidator {
  private readonly path: string;
  public constructor({ path }: { path: string }) {
    this.path = path;
  }

  public validate = (booking: Booking): ValidatorError[] => {
    return [
      CommonValidator.validateUTCDateTime(`${this.path}.utcCreatedAt`, booking?.utcCreatedAt),
      CommonValidator.validateUTCDateTime(`${this.path}.utcUpdatedAt`, booking?.utcUpdatedAt),
      NullValidator.validate(`${this.path}.utcExpiresAt`, booking?.utcExpiresAt),
      NullValidator.validate(`${this.path}.utcRedeemedAt`, booking?.utcRedeemedAt),
      CommonValidator.validateUTCDateTime(`${this.path}.utcConfirmedAt`, booking?.utcConfirmedAt, { nullable: true }),
      ...this.validateCancellation(booking),
    ].flatMap((v) => (v ? [v] : []));
  };

  private readonly validateCancellation = (booking: Booking): ValidatorError[] =>
    [
      StringValidator.validate(`${this.path}.cancellation.refund`, booking?.cancellation?.refund),
      StringValidator.validate(`${this.path}.cancellation.reason`, booking?.cancellation?.reason, { nullable: true }),
      CommonValidator.validateUTCDateTime(
        `${this.path}.cancellation.utcCancelledAt`,
        booking?.cancellation?.utcCancelledAt,
      ),
    ].flatMap((v) => (v ? [v] : []));
}
