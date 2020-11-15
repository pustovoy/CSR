(function() {
	'use strict';

	const overrideCtx = {
		Templates: {
			Fields: {
				'Color': {
					View: function(ctx) {
						return `<div class="item-color" style="background-color: ${ctx.CurrentItem.Color}"></div>`;
					}
				},
				'Description': {
					View: descriptionFieldTemplate
				},
				'Price': {
					View: function(ctx) {
						return `${ctx.CurrentItem.Price} USD`;
					}
				}
			}
		}
	};

	function descriptionFieldTemplate(ctx) {
		let imagesHtml = '';
		const itemId = ctx.CurrentItem.ID;
		const description = ctx.CurrentItem.Description;

		getItemAttachments(itemId, ctx.ListTitle)
		.then(data => {
			data.forEach(element => {
				imagesHtml += `<img src="${window.location.origin}${element.ServerRelativeUrl}" width="140">`;
			});	
			$(`#item-images-${itemId}`).append(imagesHtml);
			$(`#item-images-${itemId}`).click(event => {
				console.log($(event.target)[0].currentSrc);
			});
		})
		.catch(err => {
			console.log(err);
		});			
		return `<div class="item-description">
					<div id="item-images-${itemId}" class="item-description--images">${imagesHtml}</div>
					<div class="item-description--text">${description}</div>
				</div>`;
	}

	function getItemAttachments(itemId, listName) {
		const requestUri = `${_spPageContextInfo.webAbsoluteUrl}/_api/web/lists/getbytitle('${listName}')/items(${itemId})/AttachmentFiles`;
		return new Promise ((resolve, reject) => {
			$.ajax({
				url: requestUri,
				type: "GET",
				headers: { "ACCEPT": "application/json;odata=verbose" },
				success: function (data) {
					resolve(data.d.results);   
				},
				error: function (err) {
					reject(err);
				}
			});
		});
	}

	SPClientTemplates.TemplateManager.RegisterTemplateOverrides(overrideCtx);
})();