import { singleton, inject } from 'tsyringe';
import { IRequest } from 'itty-router';
import { JsonResponseFactory } from '../../../../http/json/JsonResponseFactory';
import { RequestHandler } from '../../../../http/request/RequestHandler';
import { SessionNotFoundError } from '../../../../../common/validation/v2/session/error/SessionNotFoundError';
import { ErrorResponseFactory } from '../../../../http/error/ErrorResponseFactory';
import { SessionScenarioStepNotAllowedError } from '../../../../../common/validation/v2/session/error/SessionScenarioStepNotAllowedError';
import { SessionScenarioNotSetError } from '../../../../../common/validation/v2/session/error/SessionScenarioNotSetError';
import { BodyParser } from '../../../../util/BodyParser';
import { ValidationError } from '../../../../../common/validation/v2/validator/error/ValidationError';
import { HttpError } from '@octocloud/core';
import { BookingFacade } from '../../../../../common/validation/v2/facade/booking/BookingFacade';

@singleton()
export class BookingCancellationHandler implements RequestHandler {
  public constructor(
    @inject(JsonResponseFactory) private readonly jsonResponseFactory: JsonResponseFactory,
    @inject(ErrorResponseFactory) private readonly errorResponseFactory: ErrorResponseFactory,
    @inject(BookingFacade) private readonly bookingFacade: BookingFacade,
  ) {}

  public async handleRequest(request: IRequest): Promise<Response> {
    const bookingCancellationData = {
      uuid: request.params.bookingUuid ?? '',
      ...(await BodyParser.parseBody(request)),
    };

    try {
      const booking = await this.bookingFacade.bookingCancellation(bookingCancellationData);

      return this.jsonResponseFactory.create(booking);
    } catch (e: any) {
      if (e instanceof SessionNotFoundError) {
        return this.errorResponseFactory.createNotFoundResponse(e.message, e);
      } else if (e instanceof SessionScenarioNotSetError) {
        return this.errorResponseFactory.createBadRequestResponse(e.message, e);
      } else if (e instanceof SessionScenarioStepNotAllowedError) {
        return this.errorResponseFactory.createForbiddenResponse(e.message, e);
      } else if (e instanceof ValidationError) {
        // TODO fix
        return this.errorResponseFactory.createValidationErrorResponse(e.validationResult, e);
      } else if (e instanceof HttpError) {
        // TODO fix
        // return this.errorResponseFactory.createErrorResponse(e.status, e.validationResult, e);
      }

      throw e;
    }
  }
}
