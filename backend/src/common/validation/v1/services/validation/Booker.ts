import { Booking, BookingUnitItemSchema } from '@octocloud/types';
import { CreateBookingSchema } from '../../schemas/Booking';
import { Result } from './api/types';
import { Context } from './context/Context';
import { ProductBookable } from './context/ProductBookable';

interface CreateReservationParams {
  invalidProductId?: boolean;
  invalidOptionId?: boolean;
  invalidAvailabilityId?: boolean;
  invalidUnitItems?: boolean;
  soldOutAvailability?: boolean;
  unitItemsMissing?: boolean;
  unitItemsEmpty?: boolean;
  unitItemsQuantity?: number;
}
export class Booker {
  public createReservation = async (
    productBookable: ProductBookable,
    context: Context,
    params?: CreateReservationParams,
  ): Promise<Result<Booking>> => {
    const apiClient = context.getApiClient();
    const { product } = productBookable;

    const productId = params?.invalidProductId ? context.invalidProductId : product.id;
    const optionId = params?.invalidOptionId ? context.invalidOptionId : productBookable.getOption().id;
    const availabilityId = this.getAvailabilityId(productBookable, context, params);
    const unitItems = this.getUnitItems(productBookable, params);

    const data = {
      productId,
      optionId,
      availabilityId,
    } as CreateBookingSchema;
    if (unitItems) {
      data.unitItems = unitItems;
    }

    return await apiClient.bookingReservation(data, context);
  };

  private getAvailabilityId(
    productBookable: ProductBookable,
    context: Context,
    params?: CreateReservationParams,
  ): string | null {
    if (params?.invalidAvailabilityId) {
      return context.invalidAvailabilityId;
    } else if (params?.soldOutAvailability) {
      return productBookable.availabilityIdSoldOut;
    }
    return productBookable.randomAvailabilityID;
  }

  private getUnitItems(
    productBookable: ProductBookable,
    params?: CreateReservationParams,
  ): BookingUnitItemSchema[] | null {
    if (params?.invalidUnitItems) {
      return productBookable.getInvalidUnitItems();
    } else if (params?.unitItemsMissing) {
      return null;
    } else if (params?.unitItemsEmpty) {
      return [];
    }

    if (params?.unitItemsQuantity) {
      return productBookable.getValidUnitItems({
        quantity: params?.unitItemsQuantity,
      });
    }
    return productBookable.getValidUnitItems();
  }
}
