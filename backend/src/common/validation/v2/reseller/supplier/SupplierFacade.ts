import { inject, singleton } from 'tsyringe';
import { Backend, RequestContext } from '@octocloud/core';
import { Supplier } from '@octocloud/types';
import { SessionService } from '../../session/SessionService';
import { GetSupplierStep } from '../../step/reseller/supplier/GetSupplierStep';
import { SessionStepGuard } from '../../session/SessionStepGuard';
import { RequestContextUtil } from '../../../../util/RequestContextUtil';

@singleton()
export class SupplierFacade {
  public constructor(
    @inject('Backend') private readonly backend: Backend,
    @inject(GetSupplierStep) private readonly getSupplierStep: GetSupplierStep,
    @inject(SessionService) private readonly sessionService: SessionService,
    @inject(SessionStepGuard) private readonly sessionStepGuard: SessionStepGuard,
  ) {}

  public async getSupplier(sessionId: string): Promise<Supplier> {
    const session = await this.sessionService.getSession(sessionId);

    await this.sessionStepGuard.check(session, this.getSupplierStep);
    await this.sessionService.updateSession({
      id: sessionId,
      currentStep: this.getSupplierStep.getId(),
    });

    return await this.backend.getSupplier({
      ctx: RequestContextUtil.create(),
    });
  }
}
