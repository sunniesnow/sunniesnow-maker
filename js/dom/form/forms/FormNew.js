Sunniesnow.FormNew = class FormNew extends Sunniesnow.Form {

	constructor() {
		super([
{
	id: "path",
	type: "text",
	label: "Project name:",
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
	label: "Title:"
},
{
	id: "music",
	type: "file",
	label: "Music file:",
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
	label: "Artist:"
},
{
	id: "baseBpm",
	type: "number",
	label: "Base BPM:",
	attributes: {
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
	attributes: {
		step: 0.001
	}
},
{
	id: "charts",
	type: "list",
	label: "Metadata of charts:",
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
			label: "Charter:"
		},
		{
			id: "difficultyName",
			type: "text",
			label: "Difficulty name:"
		},
		{
			id: "difficultyColor",
			type: "radio",
			label: "Difficulty color:",
			items: [
				{
					label: "<span style=\"color: #ffffff\">Preset 1</span>",
					value: "#ffffff"
				},
				{
					label: "<span style=\"color: #ff0000\">Preset 2</span>",
					value: "#ff0000"
				},
				{
					label: "<span style=\"color: #00ff00\">Preset 3</span>",
					value: "#00ff00"
				},
				{
					label: "<span style=\"color: #0000ff\">Preset 4</span>",
					value: "#0000ff"
				},
				{
					label: "<span style=\"color: #ffff00\">Preset 5</span>",
					value: "#ffff00"
				},
				{
					label: "Other:",
					subform: [
						{
							id: "otherDifficultyColor",
							type: "color"
						}
					]
				}
			]
		},
		{
			id: "difficulty",
			type: "text",
			label: "Difficulty:"
		}
	]
}
		]);

	}

};
