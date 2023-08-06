Sunniesnow.FormNew = class FormNew extends Sunniesnow.Form {

	constructor() {
		super([
{
	id: "name",
	type: "text",
	label: "Project name:",
	hint: "The name of the project; may use slashes (<code>/</code>) to specify directories",
	attributes: {
		value: `project-${Date.now()}`,
	},
	validityCheck(value) {
		if (value === '') {
			return 'Project name cannot be empty';
		}
		if (localStorage.getItem(Sunniesnow.Project.localStorageKey(value))) {
			return `Project <code>${Sunniesnow.Utils.escapeHtml(value)}</code> already exists`;
		}
	}
},
{
	id: "title",
	type: "text",
	label: "Title:",
	hint: "The title of the project, usually the title of the music"
},
{
	id: "music",
	type: "file",
	label: "Music file:",
	hint: "The music file of the project",
	attributes: {
		accept: "audio/*"
	},
	validityCheck(value) {
		if (!value) {
			return 'Music file is required';
		}
	}
},
{
	id: "artist",
	type: "text",
	label: "Artist:",
	hint: "The artist of the music"
},
{
	id: "baseBpm",
	type: "number",
	label: "Base BPM:",
	hint: "The BPM before the first BPM change",
	attributes: {
		value: 120,
		min: 1
	},
	validityCheck(value) {
		if (value < 1) {
			return 'Base BPM must be at least 1';
		}
	}
},
{
	id: "offset",
	type: "number",
	label: "Offset (in seconds):",
	hint: "The time of the zeroth beat of the music",
	attributes: {
		value: 0,
		step: 0.001
	}
},
{
	id: "charts",
	type: "list",
	label: "Metadata of charts:",
	hint: "The metadata of the charts of the project",
	validityCheck(value) {
		if (value.length === 0) {
			return 'At least one chart is required';
		}
	},
	subform: [
		{
			id: "name",
			type: "text",
			label: "Name:",
			hint: "The name of the chart; will be used as the file basename, so must obey UNIX filename rules",
			validityCheck(value) {
				if (value === '') {
					return 'Name cannot be empty';
				}
				if (value.includes('/')) {
					return 'Name cannot contain "/"';
				}
				if (value.includes('\0')) {
					return 'Name cannot contain null character';
				}
			}
		},
		{
			id: "charter",
			type: "text",
			label: "Charter:",
			hint: "The charter of the chart"
		},
		{
			id: "difficultyName",
			type: "text",
			label: "Difficulty name:",
			hint: "The difficulty name of the chart",
			attributes: {
				value: "Master"
			}
		},
		{
			id: "difficultyColor",
			type: "radio",
			label: "Difficulty color:",
			hint: "The difficulty color of the chart",
			items: [
				{
					label: "<span style=\"color: #3eb9fd\">Preset 1</span>",
					value: "#3eb9fd",
					hint: "#3eb9fd"
				},
				{
					label: "<span style=\"color: #f19e56\">Preset 2</span>",
					value: "#f19e56",
					hint: "#f19e56"
				},
				{
					label: "<span style=\"color: #e75e74\">Preset 3</span>",
					value: "#e75e74",
					hint: "#e75e74"
				},
				{
					label: "<span style=\"color: #8c68f3\">Preset 4</span>",
					value: "#8c68f3",
					hint: "#8c68f3",
					attributes: {
						checked: true
					}
				},
				{
					label: "<span style=\"color: #f156ee\">Preset 5</span>",
					value: "#f156ee",
					hint: "#f156ee"
				},
				{
					label: "Other:",
					value: "other",
					hint: "Specify another color using a color picker",
					subform: [
						{
							id: "difficultyColorOther",
							type: "color"
						}
					]
				}
			]
		},
		{
			id: "difficulty",
			type: "text",
			label: "Difficulty:",
			hint: "The difficulty of the chart",
			attributes: {
				value: "?"
			}
		}
	]
}
		]);

	}

};
