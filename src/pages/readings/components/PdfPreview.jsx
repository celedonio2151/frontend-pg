import React from "react";

export default function PdfPreview({ dataPDF }) {
	return (
		<iframe
			src={dataPDF}
			// src="https://docs.google.com/viewerng/viewer?url=http://infolab.stanford.edu/pub/papers/google.pdf&embedded=true"
			frameBorder="0"
			// style="visibility:visible"
			height="100%"
			width="100%"
		></iframe>
	);
}
