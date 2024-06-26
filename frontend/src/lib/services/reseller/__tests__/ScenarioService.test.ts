import { it, expect, vi, describe, beforeEach } from 'vitest';
import { resellerScenariosListLoadingStore, resellerSessionStore } from '../../../stores';
import { get } from 'svelte/store';
import { ScenariosService } from '../ScenarioService';
import { ScenarioProgressStepStatus } from '$lib/types/Session';

describe('ScenariosService', async () => {
	const step = {
		id: 'step1',
		name: 'Step 1',
		description: 'Description 1',
		endpointUrl: 'http://localhost:3000',
		docsUrl: 'http://localhost:3000',
		status: ScenarioProgressStepStatus.PENDING_VALIDATION,
		questions: [],
		endpointMethod: 'GET'
	};
	beforeEach(() => {
		resellerSessionStore.set({
			session: {
				id: 'session1',
				name: 'Session 1',
				capabilities: [],
				currentScenario: null,
				scenariosProgress: [
					{
						id: 'scenario1',
						name: 'Scenario 1',
						description: 'Description 1',
						requiredCapabilities: [],
						optionalCapabilities: [],
						steps: [step]
					},
					{
						id: 'scenario2',
						name: 'Scenario 2',
						description: 'Description 2',
						requiredCapabilities: [],
						optionalCapabilities: [],
						steps: [step]
					}
				],
				url: 'http://localhost:3000'
			},
			isLoading: false,
			error: null
		});
	});
	it('should successfully fetch scenarios', async () => {
		const mockScenarios = [
			{ id: 'scenario1', name: 'Scenario 1', steps: [step] },
			{ id: 'scenario2', name: 'Scenario 2', steps: [step] }
		];

		global.fetch = vi
			.fn()
			.mockReturnValueOnce(new Response(JSON.stringify(mockScenarios), { status: 200 }));

		// eslint-disable-next-line
		await ScenariosService.getScenarios({} as any);

		expect(get(resellerSessionStore).session?.scenariosProgress).toEqual(mockScenarios);
		expect(get(resellerSessionStore).isLoading).toBe(false);
		expect(get(resellerSessionStore).error).toBe(null);
	});

	it('should fail to fetch scenarios', async () => {
		global.fetch = vi.fn().mockReturnValueOnce(new Response(null, { status: 500 }));

		// eslint-disable-next-line
		await ScenariosService.getScenarios({ trigger: () => {} } as any);

		expect(get(resellerSessionStore).error).toBe('Failed to fetch scenarios');
		expect(get(resellerScenariosListLoadingStore)).toBe(false);
	});
});
