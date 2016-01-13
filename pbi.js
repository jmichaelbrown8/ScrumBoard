var mongoose = require('mongoose');

var pbiSchema = {
	who: { type: String },
	what: { type: String, required: true },
	why: { type: String },
	size: { enum: ["S", "M", "L"] },
	value: { enum: ["$", "$$", "$$$", "$$$$"] },
	order: { type: Number, default: -1 },
	acceptanceCriteria: [{ type: String }],
	active: { type: Boolean }
};

module.exports = new mongoose.Schema(pbiSchema);
module.exports.pbiSchema = pbiSchema;