import { useState, useEffect } from '@wordpress/element';

const { apiFetch } = wp;
const { addQueryArgs } = wp.url;

export const useMediaDataFetch = (attributes) => {
  const { youtube_id, video_poster_img } = attributes;

  const [embedHtml, setEmbedHtml] = useState(null);
  const [posterURL, setPosterUrl] = useState(null);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);

  const loadMediaData = async () => {
    if (loading) {
      return;
    }
    setLoading(true);

    try {
      const response = await apiFetch({ path: addQueryArgs('planet4/v1/get-media-data', { youtube_id, video_poster_img }) });

      setEmbedHtml(response.embed_html);
      setPosterUrl(response.poster_url);
    } catch (e) {
      console.log(e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMediaData();
  }, [ youtube_id ]);

  return {
    embedHtml,
    posterURL,
    loading,
    error,
  };
};
