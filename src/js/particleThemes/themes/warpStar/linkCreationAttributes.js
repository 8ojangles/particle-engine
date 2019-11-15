let linkCreationAttributes = [
	{	
		type: 'map',
		function: 'linear',
		src: 'velAcceleration',
		target: 'targetRadius',
		attr: 'targetRadius'
	},
	{	
		type: 'map',
		function: 'linear',
		src: 'velAcceleration',
		target: 'radius',
		attr: 'initR'
	}
];

module.exports.linkCreationAttributes = linkCreationAttributes;