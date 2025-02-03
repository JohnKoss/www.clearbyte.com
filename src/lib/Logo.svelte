<script lang="ts">
    const width = 210;
    const height = 40;
</script>

<a href="/">
    <svg
        {width}
        {height}
        viewBox="0 0 {width} {height * 2}"
        xmlns="http://www.w3.org/2000/svg"
    >
            <text
            x="50%"
            y="50%"
            dominant-baseline="middle"
            text-anchor="middle"
            font-family="Arial, sans-serif"
            font-size="48"
            font-weight="bold"
        >
            <tspan fill="var(--color-primary)" font-style="italic">Clear</tspan
            ><tspan fill="var(--color-warning)" font-style="italic">Byte</tspan><tspan fill="var(--color-secondary)" font-family="sans-serif" font-size="30" font-weight="bold">.com</tspan>
        </text>
    </svg>
</a>
