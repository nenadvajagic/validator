import { PUBLIC_VALIDATOR_BASE_URL } from '$env/static/public';

export async function POST({ request }) {
	const url = new URL(request.url);
	const id = url.searchParams.get('id');
	const scenarioId = url.searchParams.get('scenario-id');
	const stepId = url.searchParams.get('step-id');

	const body = await request.json();

	const response = await fetch(
		`${PUBLIC_VALIDATOR_BASE_URL}/v2/session/${id}/validate-question-answers/${scenarioId}/${stepId}`,
		{
			method: 'POST',
			body: JSON.stringify(body),
			headers: {
				'Content-Type': 'application/json'
			}
		}
	);

	return response;
}
