<script lang="ts">
    export let size: "sm" | "md" | "lg";
</script>

<div
    class={size == "sm"
        ? "w-1/2"
        : size == "md"
          ? "w-2/3"
          : size == "lg"
            ? "w-3/4"
            : "w-2/3"}
>
    <slot></slot>
</div>
