class Post {

	static getPostBy (params, filter = 'posts.code,posts.userCode,posts.title,posts.body,posts.registrationDate,posts.categoryCode,users.code,users.appCode,users.diff,users.user,users.password,users.email,users.categoryCode,users.name,users.surname,users.registrationDate,users.birthDate,users.imageURL,users.recoverURLCode,users.recoverCode,postCategories.code,postCategories.name,postCategories.description', orderBy = null, order = 'asc') {

		let query = ['select'];

		let enter = false;

		let filters = filter.split(',');

		if (filters.length != 0) {

			enter = !enter;

			for (let i in filters) {

				query.push(filters[i], 'as', `"${filters[i]}"`, ',');

			}

		}

		if (enter) {

			enter = !enter;
			query.pop();

		}

		query.push('from', 'posts', 'inner', 'join', 'users', 'on', 'posts.userCode', '=', 'users.code', 'inner', 'join', 'postCategories', 'on', 'posts.categoryCode', '=', 'postCategories.code');

		if (params) {

			enter = !enter;

			query.push('where');

			let finalParams = params.split(',')

			for (let param in finalParams) {

				if (finalParams[param] == 'undefined' || param == '') {

					continue;

				}

				query.push(finalParams[param], 'and');

			}

		}

		if (enter) {

			query.pop();

		}

		if (orderBy) {

			query.push('order', 'by', orderBy, order);

		}

		return query.join(' ');

	}

}

module.exports = Post; 