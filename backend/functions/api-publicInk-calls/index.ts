// tiedosto joka hoitaa reitityksen eri API-kutsuille
// handleri funktio tarkistaa HTTP metodin ja reitittää kutsun oikeaan käsittelijään
// handleria kutsutaan API GW:n kautta

import { APIGatewayProxyHandlerV2WithJWTAuthorizer } from 'aws-lambda';
import * as publicInk from './publicInk';
import { notAllowedResponse, clientErrorResponse } from '../shared/utils';

// reititetään kutsut oikeisiin käsittelijöihin
export const handler: APIGatewayProxyHandlerV2WithJWTAuthorizer = async (
  event
): Promise<any> => {
  const httpMethod = event.requestContext.http.method;
  // routeKey on muotoa "GET /key" ym.
  const routeKey = event.routeKey.split(' ')[1];
  const pathParameters = event.pathParameters;

  if (httpMethod === 'GET' && routeKey === '/publicInk') {
    return publicInk.listPublicInks();
  }

  if (httpMethod === 'GET' && routeKey === '/publicInk/{id}') {
    if (!pathParameters?.id) {
      return clientErrorResponse('Missing required parameter');
    }
    return publicInk.getPublicInk(pathParameters.id);
  }
  return notAllowedResponse();

  /* lisää reitityksiä */
};
