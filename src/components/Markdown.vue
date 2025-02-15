<script setup lang="ts">
import highlight from "highlight.js";
import MarkdownIt from "markdown-it";

const markdown = new MarkdownIt({
  // Thanks https://github.com/microsoft/AdaptiveCards/discussions/8081#discussioncomment-4219420
  highlight: (source, language): string => {
    let result = "";

    if (language && highlight.getLanguage(language)) {
      try {
        result = highlight.highlight(source, { language }).value;
      } catch (err) {
        console.warn("Error highlighting code block.", err);
      }
    }

    return result;
  },
});

defineProps({
  md: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <div v-html="markdown.render(md)" />
</template>
