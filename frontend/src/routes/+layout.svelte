<script>
    import "../app.css";
    import { ClockSolid } from "flowbite-svelte-icons";
    import { UserSolid } from "flowbite-svelte-icons";
    import { HomeSolid } from "flowbite-svelte-icons";
</script>

<div class="p-8">
    <div class="flex items-center gap-8">
        <h1 class="text-[36px] font-bold font-sans">corner cut</h1>
        <nav class="flex gap-4 items-center">
            <a href="/timer">
                <ClockSolid class="text-sub hover:text-text" />
            </a>
            <a href="/profile">
                <UserSolid class="text-sub hover:text-text" />
            </a>
            <a href="/">
                <HomeSolid class="text-sub hover:text-text  " />
            </a>
        </nav>
    </div>

    <slot></slot>
</div>
