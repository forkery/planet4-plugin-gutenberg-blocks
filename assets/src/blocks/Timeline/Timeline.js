import { useScript } from './useScript';
import { useStyleSheet } from './useStyleSheet';
import { useRef, useEffect } from 'react';
import { uniqueId } from 'lodash';

const TIMELINE_JS_VERSION = '3.6.6';

export const Timeline = (props) => {
	const {
		google_sheets_url,
		timenav_position,
		start_at_end,
		language
	} = props;

	const timelineNode = useRef(null);

	useStyleSheet(
    `https://cdnjs.cloudflare.com/ajax/libs/timelinejs/${TIMELINE_JS_VERSION}/css/timeline.css`
	);

  const setupTimeline = function() {
		timelineNode.current.id = uniqueId('timeline');

		new TL.Timeline(timelineNode.current.id, google_sheets_url, {
			'timenav_position': timenav_position,
			'start_at_end': start_at_end,
			'language': language
		});
	}

	const [loaded, error] = useScript(
		`https://cdnjs.cloudflare.com/ajax/libs/timelinejs/${TIMELINE_JS_VERSION}/js/timeline-min.js`
	);

	useEffect(
		() => {
			if (loaded) {
				setupTimeline(loaded);
			}
		},
		[
			loaded,
			start_at_end,
			google_sheets_url,
			timenav_position,
			language,
		],
	);

	return <div ref={ timelineNode }></div>
}
