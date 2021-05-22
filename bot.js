module.exports = {
	emojis: {
		part: '<:part:832700123427110922>',
		level: '<:level:833717869044957294>',
		heads: '<:heads:835062502437027840>',
		tails: '<:tails:835062503662288936>',
		axes: '<:axes:842756116890517575>',
		shapes: {
			cube: '<:cube:833268501791768586>',
			sphere: '<:sphere:833268525136216094>',
			pyramid: '<:pyramid:833315905697742858>',
		},
	},
	trees: {
		shapes: ['cube', 'sphere', 'pyramid'],
		shapese:        ['sphere', 'pyramid'],
	},
	shaper: {
		prices: {
			cube: 0,
			sphere: 5,
			pyramid: 20,
		},
		adjectives: ['shiny', 'sparkling', 'nice', 'fresh'],
	},
	checklist: {
		ids: ['levelup'],
		tls: ['Level-Up'],
		convertToId(tl) {
			return this.ids[this.tls.indexOf(tl)];
		},
		convertToTl(id) {
			return this.tls[this.ids.indexOf(id)];
		}
	}
};