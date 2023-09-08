import { computed, ref, toRefs, watch } from 'vue';
import type { ImgHTMLAttributes } from 'vue/types/jsx';
export interface UseImageProps {
  /**
   * The image `src` attribute
   */
  src?: string;
  /**
   * The image `srcset` attribute
   */
  srcSet?: string;
  /**
   * The image `sizes` attribute
   */
  sizes?: string;
  /**
   * If `true`, opt out of the `fallbackSrc` logic and use as `img`
   */
  ignoreFallback?: boolean;
  /**
   * The key used to set the crossOrigin on the HTMLImageElement into which the image will be loaded.
   * This tells the browser to request cross-origin access when trying to download the image data.
   */
  crossOrigin?: ImgHTMLAttributes["crossorigin"];
  loading?: "eager" | "lazy" | undefined;
}

interface ImageEvents {
  /**
     * A callback for when the image `src` has been loaded
     */
  onLoad?: ImgHTMLAttributes["onLoad"];
  /**
   * A callback for when there was an error loading the image `src`
   */
  onError?: ImgHTMLAttributes["onError"];
}

type Status = "loading" | "failed" | "pending" | "loaded";

export function useImage(props: UseImageProps = {}, events: ImageEvents) {
  const { src, srcSet, sizes, ignoreFallback, crossOrigin, loading } = toRefs(props)
  const { onLoad, onError } = events
  const status = ref<Status>('pending')

  watch([()=>src?.value], () => {
    status.value = src?.value ? 'loading' : 'pending'
  },{
    immediate:true
  })


  let imageRef:HTMLImageElement | null

  const load = () => {
    if (!src?.value) return

    flush();

    const img = new Image();
    img.src = src.value;
    if (crossOrigin?.value) img.crossOrigin = crossOrigin.value;
    if (srcSet?.value) img.srcset = srcSet.value;
    if (sizes?.value) img.sizes = sizes.value;
    if (loading?.value) img.loading = loading.value;

    img.onload = (event) => {
      flush();
      status.value = 'loaded'
      onLoad?.(event)
    };

    img.onerror = (error)=>{
      // flush();
      status.value = 'failed'
      onError?.(error as any);
    }

    imageRef = img
  }

  const flush = () => {
    if (imageRef) {
      imageRef.onload = null;
      imageRef.onerror = null;
      imageRef = null;
    }
  };

  watch([status,()=>ignoreFallback?.value],()=>{
     flush()
     /**
     * If user opts out of the fallback/placeholder
     * logic, let's bail out.
     */
     if (ignoreFallback?.value) return undefined;
     if (status.value === "loading") {
      load();
    }
  },{
    immediate:true
  })

  return computed(()=>{
    return ignoreFallback?.value ? "loaded" : status.value;
  })
}
