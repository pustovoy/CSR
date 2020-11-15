(function() {
	'use strict';

	const overrideCtx = {
		Templates: {
			Fields: {
				'Color': {
					DisplayForm: function(ctx) {
						return `<div class="item-color" style="background-color: ${ctx.CurrentItem.Color}"></div>`;
					}
				},
				'Price': {
					DisplayForm: function(ctx) {
						return `${ctx.CurrentItem.Price} USD`;
					}
				},
				'Attachments': {
					DisplayForm: attachmentsViewFieldTemplate,
				}
			},
			OnPostRender: function(ctx) {
				if (ctx.BaseViewID !== "DisplayForm") {
					switch(ctx.ListSchema.Field[0].Title) {
						case "Color":
							setDropdownColors(ctx);
							break;

						case "Price":
							setCurrencyMarker(ctx);
							break;

						default:
							break;
					}
				}
			}
		}
	};

	window.onload = function() {
		$(`#idAttachmentsRow`).show();
	};

	function setDropdownColors(ctx) {
		let colorField = window[`${ctx.FormUniqueId}FormCtx`].ListSchema["Color"];
		let colorFieldControlId = `${colorField.Name}_${colorField.Id}_$DropDownChoice`;
		
		let selectedOption = Array.prototype.find.call($get(colorFieldControlId).childNodes, el => el.selected).value.toLowerCase();

		$get(colorFieldControlId).classList.add(`option-color__${selectedOption}`);

		$get(colorFieldControlId).childNodes.forEach(function(option, currentIndex, listObj) {
			$(option).addClass(`option-color__${option.value.toLowerCase()}`);
		});
	}

	function setCurrencyMarker(ctx) {
		let priceField = window[`${ctx.FormUniqueId}FormCtx`].ListSchema["Price"];
		let priceFieldControlId = `${priceField.Name}_${priceField.Id}_$NumberField`;

		$get(priceFieldControlId).after(" USD");
	}

	function attachmentsViewFieldTemplate(ctx) {
		let imagesHtml = '';	

		if (WPQ2FormCtx.ListData.Attachments.Attachments.length > 0) {
			WPQ2FormCtx.ListData.Attachments.Attachments.forEach(attachment => {
				imagesHtml += `<img src="${ctx.CurrentFieldValue.UrlPrefix}${attachment.FileName}" width="200" alt="${attachment.FileName}" onclick="window.open('${ctx.CurrentFieldValue.UrlPrefix}${attachment.FileName}')">`;
			});
		}

		return `<div class="item-attachments">${imagesHtml}</div>`;
	}

	SPClientTemplates.TemplateManager.RegisterTemplateOverrides(overrideCtx);
})();