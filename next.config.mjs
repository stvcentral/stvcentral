export default {
  output:'standalone',
  serverExternalPackages:['node:sqlite'],
  outputFileTracingExcludes:{'/*':['./.build-tools/**/*','./.pnpm-store/**/*','./runtime/**/*','./.test-runtime/**/*','./.git/**/*','./private/**/*','./public/**/*','./.env*']},
  poweredByHeader:false,
  async headers(){return [{source:'/:path*',headers:[
    {key:'X-Content-Type-Options',value:'nosniff'},
    {key:'X-Frame-Options',value:'DENY'},
    {key:'Referrer-Policy',value:'strict-origin-when-cross-origin'},
    {key:'Permissions-Policy',value:'camera=(), microphone=()'},
    {key:'Content-Security-Policy',value:"frame-ancestors 'none'; base-uri 'self'; form-action 'self'"}
  ]},{source:'/playlist',headers:[{key:'Permissions-Policy',value:'camera=(self), microphone=()'}]}];}
};
