import { CapabilityId } from '@octocloud/types';
import { inject, registry, singleton } from 'tsyringe';
import { Scenario } from '../Scenario';
import { GetSupplierStep } from '../../step/reseller/supplier/GetSupplierStep';
import { GetProductsStep } from '../../step/reseller/product/GetProductsStep';
import { Step } from '../../step/Step';
import { ScenarioId } from '../ScenarioId';
import { StepLinkedListFactory } from '../../step/StepLinkedListFactory';
import { DoublyLinkedList } from 'linked-list-typed';
import { GetProductStep } from '../../step/reseller/product/GetProductStep';
import { AvailabilityCalendarStep } from '../../step/reseller/availability/AvailabilityCalendarStep';
import { AvailabilityCheckStep } from '../../step/reseller/availability/AvailabilityCheckStep';
import { BookingReservationStep } from '../../step/reseller/booking/BookingReservationStep';
import { BookingConfirmationStep } from '../../step/reseller/booking/BookingConfirmationStep';
import { BookingCancellationStep } from '../../step/reseller/booking/BookingCancellationStep';

@singleton()
@registry([
  { token: AdvancedScenario.name, useClass: AdvancedScenario },
  { token: 'ResellerScenario', useClass: AdvancedScenario },
])
export class AdvancedScenario implements Scenario {
  public readonly capabilities: CapabilityId[] = [];

  public constructor(
    @inject(GetSupplierStep) private readonly getSupplierStep: GetSupplierStep,
    @inject(GetProductsStep) private readonly getProductsStep: GetProductsStep,
    @inject(GetProductStep) private readonly getProductStep: GetProductStep,
    @inject(AvailabilityCalendarStep) private readonly availabilityCalendarStep: AvailabilityCalendarStep,
    @inject(AvailabilityCheckStep) private readonly availabilityCheckStep: AvailabilityCheckStep,
    @inject(BookingReservationStep) private readonly bookingReservationStep: BookingReservationStep,
    @inject(BookingConfirmationStep) private readonly bookingConfirmationStep: BookingConfirmationStep,
    @inject(BookingCancellationStep) private readonly bookingCancellationStep: BookingCancellationStep,
  ) {
    this.capabilities = this.getRequiredCapabilities().concat(this.getOptionalCapabilities());
  }

  public getId(): ScenarioId {
    return ScenarioId.ADVANCED_SCENARIO;
  }

  public getName(): string {
    return 'Advanced Scenario';
  }

  public getDescription(): string {
    return 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Maecenas ipsum velit, consectetuer eu lobortis ut, dictum at dui. Morbi scelerisque luctus velit. Ut tempus purus at lorem. Sed convallis magna eu sem. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Etiam commodo dui eget wisi. Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur? Integer pellentesque quam vel velit. Suspendisse nisl. In sem justo, commodo ut, suscipit at, pharetra vitae, orci. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';
  }

  public getRequiredCapabilities(): CapabilityId[] {
    return [];
  }

  public getOptionalCapabilities(): CapabilityId[] {
    return [CapabilityId.Pricing, CapabilityId.Cart];
  }

  public getCapabilities(): CapabilityId[] {
    return this.capabilities;
  }

  public getSteps(): DoublyLinkedList<Step> {
    return StepLinkedListFactory.create([
      this.getSupplierStep,
      this.getProductsStep,
      this.getProductStep,
      this.availabilityCalendarStep,
      this.availabilityCheckStep,
      this.bookingReservationStep,
      this.bookingConfirmationStep,
      this.bookingCancellationStep,
    ]);
  }
}
