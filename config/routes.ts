export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './user/Login',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/article',
    name: 'article',
    icon: 'table',
    component: './Article',
  },
  {
    path: '/',
    redirect: '/article',
  },
  {
    component: './404',
  },
];
