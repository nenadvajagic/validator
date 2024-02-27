import { CapabilityId } from '@octocloud/types';
import { string } from 'yup';
import { $enum } from 'ts-enum-util';

export const octoCapabilitiesValidator = string().test((capabilities, ctx) => {
  if (capabilities === undefined) {
    return ctx.createError({ message: `${ctx.path} is required.` });
  }

  if (capabilities === '') {
    return true;
  }

  let parsedCapabilities: string[];
  if (capabilities.includes(',')) {
    parsedCapabilities = capabilities
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  } else {
    parsedCapabilities = [capabilities.trim()];
  }

  const availableCapabilities = $enum(CapabilityId).getValues() as string[];

  for (const parsedCapability of parsedCapabilities) {
    if (!availableCapabilities.includes(parsedCapability)) {
      return ctx.createError({
        message: `Octo-Capabilities contains invalid value, values must be one of the following: ${$enum(CapabilityId)
          .getValues()
          .join(', ')}`,
      });
    }
  }

  return true;
});
