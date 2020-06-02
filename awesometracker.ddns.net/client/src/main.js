import Vue from 'vue';
import Router from 'vue-router';

import {FUNCTIONS} from './functions/functions.js';

Vue.prototype.$functions = FUNCTIONS;

import 'bootstrap/dist/js/bootstrap.min.js';
import 'bootstrap/dist/css/light_bootstrap.css';

import App from './App.vue';
import Index from './Index.vue';
import Login from './Login.vue';
import Registry from './Registry.vue';
import ForgotPassword from './ForgotPassword.vue';
import RecoverUser from './RecoverUser.vue';

import Doc_Index from './Doc_Index.vue';
import Doc_Default from './components/Doc_Default.vue'
import Doc_API from './components/Doc_API.vue'
import Doc_Terms from './components/Doc_Terms.vue'
import Doc_Privacy from './components/Doc_Privacy.vue'

import Dashboard_Index from './Dashboard_Index.vue';
import Dashboard_Default from './components/Dashboard_Default.vue';
import Dashboard_Downloads from './components/Dashboard_Downloads.vue';

import Posts_Index from './components/Posts_Index.vue';
import Posts_Summary from './components/Posts_Summary.vue';
import Posts_Post from './components/Posts_Post.vue';

import Metrics_Index from './components/Metrics_Index.vue';
import Metrics_Summary from './components/Metrics_Summary.vue';
import Metrics_Logs from './components/Metrics_Logs.vue';
import Metrics_Applications from './components/Metrics_Applications.vue';

import User_Index from './components/User_Index.vue';
import User_User from './components/User_User.vue';
import User_AddUser from './components/User_AddUser.vue';
import User_EditUser from './components/User_EditUser.vue';
import User_UpgradeUser from './components/User_UpgradeUser.vue';

import Apps_Index from './components/Apps_Index.vue';
import Apps_Default from './components/Apps_Default.vue';
import Apps_App from './components/Apps_App.vue';
import Apps_Summary from './components/Apps_Summary.vue';
import Apps_Users from './components/Apps_Users.vue';
import Apps_Logs from './components/Apps_Logs.vue';
import Apps_EditApp from './components/Apps_EditApp.vue';
import Apps_UpgradeApp from './components/Apps_UpgradeApp.vue';
import Apps_AddApp from './components/Apps_AddApp.vue';
import Apps_Applications from './components/Apps_Applications.vue';

import Admin_Index from './components/Admin_Index.vue';
import Admin_Users from './components/Admin_Users.vue';
import Admin_Logs from './components/Admin_Logs.vue';
import Admin_Applications from './components/Admin_Applications.vue';
import Admin_Apps from './components/Admin_Apps.vue';

Vue.use(Router);

const routes = [

	{path: '/', component: Index},
	{path: '/login', component: Login},
	{path: '/registry', component: Registry},
	{path: '/forgotPassword', component: ForgotPassword},
	{path: '/recoverUser', component: RecoverUser},
	{path: '/docs', component: Doc_Index, children: [

		{path: '/', components: {DocComponent: Doc_Default}},
		{path: 'api', components: {DocComponent: Doc_API}},
		{path: 'terms', components: {DocComponent: Doc_Terms}},
		{path: 'privacy', components: {DocComponent: Doc_Privacy}},

	]},
	{path: '/dashboard', component: Dashboard_Index, children: [

		{path: '/', components: {DashboardComponent:Dashboard_Default}},
		{path: 'downloads', components: {DashboardComponent: Dashboard_Downloads}},
		{path: 'posts', components: {DashboardComponent: Posts_Index}, children: [

			{path: 'summary', components: {PostsComponent: Posts_Summary}},
			{path: ':postCode', components: {PostsComponent: Posts_Post}},

		]},
		{path: 'metrics', components: {DashboardComponent: Metrics_Index}, children: [

			{path: 'summary', components: {MetricsComponent: Metrics_Summary}},
			{path: 'logs', components: {MetricsComponent: Metrics_Logs}},
			{path: 'applications', components: {MetricsComponent: Metrics_Applications}},

		]},
		{path: 'user', components: {DashboardComponent: User_Index}, children: [

			{path: 'addUser', components: {UserComponent: User_AddUser}},
			{path: ':userCode', components: {UserComponent: User_User}},
			{path: ':userCode/editUser', components: {UserComponent: User_EditUser}},
			{path: ':userCode/upgradeUser', components: {UserComponent: User_UpgradeUser}},

		]},
		{path: 'apps', components: {DashboardComponent: Apps_Index}, children: [

			{path: '/', components: {AppsComponent: Apps_Default}},
			{path: 'addApp', components: {AppsComponent: Apps_AddApp}},
			{path: 'summary', components: {AppsComponent: Apps_Summary}},
			{path: 'users', components: {AppsComponent: Apps_Users}},
			{path: 'applications', components: {AppsComponent: Apps_Applications}},
			{path: 'logs', components: {AppsComponent: Apps_Logs}},
			{path: ':appCode', components: {AppsComponent: Apps_App}},
			{path: ':appCode/editApp', components: {AppsComponent: Apps_EditApp}},
			{path: ':appCode/upgradeApp', components: {AppsComponent: Apps_UpgradeApp}},

		]},
		{path: 'admin', components: {DashboardComponent: Admin_Index}, children: [

			{path: 'users', components: {AdminComponent: Admin_Users}},
			{path: 'logs', components: {AdminComponent: Admin_Logs}},
			{path: 'applications', components: {AdminComponent: Admin_Applications}},
			{path: 'apps', components: {AdminComponent: Admin_Apps}},

		]}

	]}

];

const router = new Router({

	routes: routes,
	mode: 'history',
	scrollBehavior: (to, from, savedPosition) => {

		if (savedPosition) {

			return savedPosition;

		} else if (to.hash) {

			let item = document.getElementById(to.hash.replace('#', ''));
			let wrapper = document.getElementById('central');
			let count = item.offsetTop - wrapper.scrollTop - 64;
			wrapper.scrollBy({top: count, left: 0, behavior: 'smooth'});

		} else {

			return {

				x: 0,
				y: 0

			};

		}

	}

});

new Vue({

	el: '#app',
	render: h => h(App),
	router: router

});