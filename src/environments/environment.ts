// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  gitBranch: '',
  apiUrl: 'https://dqb2a3s7q1.execute-api.eu-north-1.amazonaws.com',
  cognitoClientId: '3sfdbebp66d23d5kj6svpi3qbj',
  cognitoUserPoolAuthority:
    'https://cognito-idp.eu-north-1.amazonaws.com/eu-north-1_v3KWSl9JX',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
