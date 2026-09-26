<script lang="ts">
  import { page } from "$app/state";
  import { buttonVariants } from "$lib/components/ui/button";
</script>

<div class="flex min-h-screen flex-col items-center justify-center gap-3 text-center bg-gray-50">
  <p class="text-4xl font-bold text-gray-900">{page.status}</p>
  <p class="text-lg text-muted-foreground mb-4">{page.error?.message ?? "Terjadi kesalahan yang tidak terduga"}</p>
  <a href="/" class={buttonVariants()}>Kembali ke beranda</a>
</div>
