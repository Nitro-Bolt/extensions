/*
 * Name: 3D Vectors & Quaternions
 * ID: divVecQuat
 * Description: Perform 3D Math and Rotations with Vectors and Quaternions.
 * By: Div <https://github.com/Dicuo>
 * By: Drago Cuven <https://github.com/Drago-Cuven>
 */
(async function(Scratch) {
    'use strict';

    if (!Scratch.extensions.unsandboxed) {
        alert("'3D Vectors & Quaternions' must run unsandboxed!");
        return;
    }

    if (!Scratch.extensions.isNitroBolt) {
        alert("'3D Vectors & Quaternions' must be loaded in NitroBolt");
        return;
    }

    const {BlockType, ArgumentType, Cast, vm} = Scratch;

    function formatNumber(x) {
        if (x >= 1e6) return x.toExponential(4);
        x = Math.floor(x * 1000) / 1000;
        return x.toFixed(Math.min(3, (String(x).split('.')[1] || '').length));
    }

    function span(text) {
        const element = document.createElement('span');
        element.innerHTML = text;
        element.style.display = 'block';
        element.style.whiteSpace = 'nowrap';
        element.style.width = '100%';
        element.style.textAlign = 'center';
        return element;
    }

    const menuIconURI = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9Ii0wLjAwMDIgLTEuMjYwNSAyMC4wMDAyIDIwLjAwMDUiIHdpZHRoPSIyMC4wMDAycHgiIGhlaWdodD0iMjEuMjYwNXB4IiB4bWxuczpieD0iaHR0cHM6Ly9ib3h5LXN2Zy5jb20iPgogIDxkZWZzPgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJncmFkaWVudC00LTAiIGhyZWY9IiNncmFkaWVudC00IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDE9IjEwIiB5MT0iMCIgeDI9IjEwIiB5Mj0iMjAiIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMSwgMCwgMCwgMSwgLTAuMDAwMzA3LCAtMS4yNjA5OTgpIi8+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImdyYWRpZW50LTQiPgogICAgICA8dGl0bGU+Um90b3IgT3V0bGluZTwvdGl0bGU+CiAgICAgIDxzdG9wIHN0eWxlPSJzdG9wLWNvbG9yOiByZ2IoODAsIDI2LCAxNDIpOyIgb2Zmc2V0PSIwIi8+CiAgICAgIDxzdG9wIHN0eWxlPSJzdG9wLWNvbG9yOiByZ2IoNDIsIDIyLCA5NSk7IiBvZmZzZXQ9IjEiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImdyYWRpZW50LTEtMCIgaHJlZj0iI2dyYWRpZW50LTEiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiB4MT0iLTUiIHkxPSItMjAiIHgyPSItNSIgeTI9IjAiIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMSwgMCwgMCwgMSwgMC4wMDEwOCwgMS4yNjE0NzgpIi8+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImdyYWRpZW50LTEiPgogICAgICA8dGl0bGU+VmVjdG9yIE91dGxpbmU8L3RpdGxlPgogICAgICA8c3RvcCBzdHlsZT0ic3RvcC1jb2xvcjogcmdiKDI1LCA2OCwgNTYpOyIgb2Zmc2V0PSIwIi8+CiAgICAgIDxzdG9wIHN0eWxlPSJzdG9wLWNvbG9yOiByZ2IoNDAsIDExNSwgODMpOyIgb2Zmc2V0PSIxIi8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJncmFkaWVudC0wLTAiIGhyZWY9IiNncmFkaWVudC0wIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDE9IjEwIiB5MT0iMSIgeDI9IjEwIiB5Mj0iMTkiIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMSwgMCwgMCwgMSwgLTAuMDAwMzA3LCAtMS4yNjA5OTgpIi8+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImdyYWRpZW50LTAiIGJ4OnBpbm5lZD0idHJ1ZSI+CiAgICAgIDx0aXRsZT5Sb3RvciBGaWxsPC90aXRsZT4KICAgICAgPHN0b3Agb2Zmc2V0PSIwIiBzdHlsZT0ic3RvcC1jb2xvcjogcmdiKDE5MiwgNTIsIDIxMCk7Ii8+CiAgICAgIDxzdG9wIG9mZnNldD0iMSIgc3R5bGU9InN0b3AtY29sb3I6IHJnYigxNDksIDUyLCAyMTApOyIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZGllbnQtMi0yIiBocmVmPSIjZ3JhZGllbnQtMiIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIHgxPSIxNC41IiB5MT0iNS41IiB4Mj0iMTQuNSIgeTI9IjE0LjUiIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMCwgLTIuMDAwMjM0LCAyLjAwMDIwMiwgMCwgLTEyLjE4NzUxMywgMzkuOTkwNzI5KSIvPgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJncmFkaWVudC0yIiBieDpwaW5uZWQ9InRydWUiPgogICAgICA8dGl0bGU+VmVjdG9yIEZpbGw8L3RpdGxlPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0eWxlPSJzdG9wLWNvbG9yOiByZ2IoNjAsIDE5OCwgMTExKTsiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdHlsZT0ic3RvcC1jb2xvcjogcmdiKDYwLCAxOTgsIDE0OSk7Ii8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogIDwvZGVmcz4KICA8ZWxsaXBzZSBzdHlsZT0ic3Ryb2tlLXdpZHRoOiAxOyBmaWxsOiB1cmwoJnF1b3Q7I2dyYWRpZW50LTQtMCZxdW90Oyk7IiBjeD0iMTAiIGN5PSI4Ljc0IiByeD0iMTAiIHJ5PSIxMCIgdHJhbnNmb3JtPSJtYXRyaXgoMSwgMCwgMCwgMSwgMy41NTI3MTM2Nzg4MDA1MDFlLTE1LCAxLjc3NjM1NjgzOTQwMDI1MDVlLTE1KSIvPgogIDxwYXRoIHN0eWxlPSJmaWxsOiB1cmwoJnF1b3Q7I2dyYWRpZW50LTEtMCZxdW90Oyk7IHRyYW5zZm9ybS1vcmlnaW46IC00Ljk5OXB4IC04LjczOXB4OyIgZD0iTSAtOS45OTkgLTE4LjczOSBBIDEwIDEwIDAgMSAxIC05Ljk5OSAxLjI2MSBBIDgxNjU2MTk2NzY1OTc2ODUwIDgxNjU2MTk2NzY1OTc2ODUwIDAgMCAxIC05Ljk5OSAtMTguNzM5IFoiIGJ4OnNoYXBlPSJjcmVzY2VudCAtOS45OTkgLTguNzM5IDEwIDE4MCAwLjUgMUA3Y2M5NDExZCIgdHJhbnNmb3JtPSJtYXRyaXgoLTEsIDAsIDAsIC0xLCA5Ljk5ODc3MjQzLCAxNy40Nzg0ODAxNSkiLz4KICA8cGF0aCBkPSJNIDE5IDguNzQgQyAxOSAxMy43MDggMTQuOTY3IDE3LjczNiAxMCAxNy43NCBDIDcuNTE4IDE3LjczNyA1LjUxNCAxNS43MjMgNS41MTQgMTMuMjQgQyA1LjUxNCAxMC43NTUgNy41MjkgOC43NCAxMC4wMTQgOC43NCBDIDEyLjQ5OSA4Ljc0IDE0LjUxNCA2LjcyNSAxNC41MTQgNC4yNCBDIDE0LjUxNCAxLjc2NiAxMi40NjkgLTAuMjQyIDEwIC0wLjI2IEMgMTQuOTQ5IC0wLjIzNCAxOSAzLjc4NSAxOSA4Ljc0IFoiIHN0eWxlPSJzdHJva2Utd2lkdGg6IDE7IGZpbGw6IHVybCgmcXVvdDsjZ3JhZGllbnQtMC0wJnF1b3Q7KTsiIHRyYW5zZm9ybT0ibWF0cml4KDEsIDAsIDAsIDEsIDMuNTUyNzEzNjc4ODAwNTAxZS0xNSwgMS43NzYzNTY4Mzk0MDAyNTA1ZS0xNSkiLz4KICA8cGF0aCBkPSJNIDEyLjMxMiAxNS40OTcgQyAxNC43OTcgMTUuNDk3IDE2LjgxMiAxMy40ODIgMTYuODEyIDEwLjk5NyBDIDE2LjgxMiA0LjA2OSA5LjMxMiAtMC4yNjEgMy4zMTIgMy4yMDMgQyAwLjUyNyA0LjgxIC0xLjE4OCA3Ljc4MiAtMS4xODggMTAuOTk3IEMgLTEuMTg4IDguNTEyIDAuODI3IDYuNDk3IDMuMzEyIDYuNDk3IEMgNS43OTcgNi40OTcgNy44MTIgOC41MTIgNy44MTIgMTAuOTk3IEMgNy44MTIgMTMuNDgyIDkuODI3IDE1LjQ5NyAxMi4zMTIgMTUuNDk3IFoiIHN0eWxlPSJzdHJva2Utd2lkdGg6IDE7IGZpbGw6IHVybCgmcXVvdDsjZ3JhZGllbnQtMi0yJnF1b3Q7KTsgdHJhbnNmb3JtLW9yaWdpbjogNy44MTJweCA4Ljc0cHg7IiB0cmFuc2Zvcm09Im1hdHJpeCgwLCAtMSwgMSwgMCwgNWUtOCwgLTAuMDAwMDAxMTgpIi8+CiAgPHBhdGggZD0iTSAxMi44OTcgNy4wNjggQyAxMy42NDggNi4zMTcgMTQuMDY5IDUuMzggMTQuMDY5IDQuMjQgQyAxNC4wNjkgMy4xIDEzLjY0OSAyLjE2MyAxMi44OTcgMS40MTIgQyAxMi4xNDYgMC42NjEgMTEuMjA5IDAuMjQgMTAuMDY5IDAuMjQgQyA2Ljc0NCAwLjI0IDQuMTY4IDEuOTYxIDIuNzA4IDQuNDkgQyAxLjI0OCA3LjAxOSAxLjAwOSAxMC4xMzEgMi43MDggMTIuOTkgQyAzLjYyOCAxNC42MjYgNS4wMDYgMTYuMDI3IDYuNjM4IDE2Ljg3NCBDIDYuNjAyIDE2Ljg0MiA2LjU2OCAxNi44MDkgNi41MzMgMTYuNzc1IEMgNS42NTYgMTUuODk4IDUuMDY4IDE0LjU4NCA1LjA2OCAxMy4yNCBDIDUuMDY4IDExLjg5NSA1LjY1NSAxMC41ODIgNi41MzMgOS43MDUgQyA3LjQxIDguODI4IDguNzI0IDguMjQgMTAuMDY4IDguMjQgQyAxMS4yMDggOC4yNCAxMi4xNDUgNy44MiAxMi44OTYgNy4wNjggTCAxMi44OTcgNy4wNjggWiIgc3R5bGU9InN0cm9rZS13aWR0aDogMTsgZmlsbC1ydWxlOiBub256ZXJvOyBwYWludC1vcmRlcjogZmlsbDsgZmlsbC1vcGFjaXR5OiAwLjI1OyBmaWxsOiByZ2IoOTMsIDIzOCwgMTc0KTsiIHRyYW5zZm9ybT0ibWF0cml4KDEsIDAsIDAsIDEsIDMuNTUyNzEzNjc4ODAwNTAxZS0xNSwgMS43NzYzNTY4Mzk0MDAyNTA1ZS0xNSkiLz4KICA8cGF0aCBkPSJNIDE3LjM5IDcuNDM1IEMgMTguMTQxIDYuNjg0IDE4LjU2MiA1Ljc0NyAxOC41NjIgNC42MDcgQyAxOC41NjIgMy40NjcgMTguMTQyIDIuNTMgMTcuMzkgMS43NzkgQyAxNi42MzkgMS4wMjggMTUuNzAyIDAuNjA3IDE0LjU2MiAwLjYwNyBDIDExLjIzNyAwLjYwNyA4LjY2MSAyLjMyOCA3LjIwMSA0Ljg1NyBDIDUuNzQxIDcuMzg2IDUuNTAyIDEwLjQ5OCA3LjIwMSAxMy4zNTcgQyA4LjEyMSAxNC45OTMgOS40OTkgMTYuMzk0IDExLjEzMSAxNy4yNDEgQyAxMS4wOTUgMTcuMjA5IDExLjA2MSAxNy4xNzYgMTEuMDI2IDE3LjE0MiBDIDEwLjE0OSAxNi4yNjUgOS41NjEgMTQuOTUxIDkuNTYxIDEzLjYwNyBDIDkuNTYxIDEyLjI2MiAxMC4xNDggMTAuOTQ5IDExLjAyNiAxMC4wNzIgQyAxMS45MDMgOS4xOTUgMTMuMjE3IDguNjA3IDE0LjU2MSA4LjYwNyBDIDE1LjcwMSA4LjYwNyAxNi42MzggOC4xODcgMTcuMzg5IDcuNDM1IEwgMTcuMzkgNy40MzUgWiIgc3R5bGU9InN0cm9rZS13aWR0aDogMTsgZmlsbC1ydWxlOiBub256ZXJvOyBwYWludC1vcmRlcjogZmlsbDsgZmlsbC1vcGFjaXR5OiAwLjI1OyBmaWxsOiByZ2IoMjM3LCA5MywgMjM4KTsgdHJhbnNmb3JtLW9yaWdpbjogMTIuMjg4M3B4IDguOTI0cHg7IiB0cmFuc2Zvcm09Im1hdHJpeCgtMSwgMCwgMCwgLTEsIDAuMDAwMDA0MTgsIDIuN2UtNykiLz4KICA8cGF0aCBkPSJNIDEyLjMxMiAxNS40OTYgQyAxNC43OTcgMTUuNDk2IDE2LjgxMiAxMy40ODEgMTYuODEyIDEwLjk5NiBDIDE2LjgxMiA0LjA2OCA5LjMxMiAtMC4yNjIgMy4zMTIgMy4yMDIgQyAwLjUyNyA0LjgwOSAtMS4xODggNy43ODEgLTEuMTg4IDEwLjk5NiBDIC0xLjE4OCA4LjUxMSAwLjgyNyA2LjQ5NiAzLjMxMiA2LjQ5NiBDIDUuNzk3IDYuNDk2IDcuODEyIDguNTExIDcuODEyIDEwLjk5NiBDIDcuODEyIDEzLjQ4MSA5LjgyNyAxNS40OTYgMTIuMzEyIDE1LjQ5NiBaIiBzdHlsZT0ic3Ryb2tlLXdpZHRoOiAxOyBmaWxsOiBub25lOyB0cmFuc2Zvcm0tb3JpZ2luOiA3LjgxMnB4IDguNzM5NDJweDsiIHRyYW5zZm9ybT0ibWF0cml4KDAsIC0xLCAxLCAwLCA1ZS04LCAtMC4wMDAwMDE2NikiLz4KICA8ZyB0cmFuc2Zvcm09Im1hdHJpeCgxLjUwODI5Njk2NjU1MjczNDYsIDAsIDAsIDEuNTA4Mjk2OTY2NTUyNzM0NiwgMjQuMTg5MzQ2NjczOTI1OTE4LCAtMC4wMDU0NzIwMDAzMDQxOTE0ODIpIiBzdHlsZT0iIj4KICAgIDxwYXRoIGQ9Ik0gLTEuNzA4IDIuMjcgSCAxLjA5NiBMIDEuMDk2IDEuOTgzIEwgMS44NDkgMi40MzEgTCAxLjA5NiAyLjg3OSBMIDEuMDk2IDIuNTkzIEggLTEuNzA4IFYgMi4yNyBaIiBieDpzaGFwZT0iYXJyb3cgLTEuNzA4IDEuOTgzIDMuNTU3IDAuODk2IDAuMzIzIDAuNzUzIDAgMUAxNWFkZTc2ZCIgc3R5bGU9ImZpbGw6IHJnYigyNTUsIDI1NSwgMjU1KTsgc3Ryb2tlLXdpZHRoOiAwLjU4NzsiIHRyYW5zZm9ybT0ibWF0cml4KDAsIC0xLCAxLCAtMC4wMDA4OTYsIC0xMy43MzgwNzQsIDIuMDE0MzI3KSIvPgogICAgPHBhdGggZD0iTSAtMTEuMzAyIDEuNzU1IEwgLTkuNjczIDIuNjk2IEwgLTkuNjczIDQuNTc2IEwgLTExLjMwMiA1LjUxNyBMIC0xMi45MzEgNC41NzcgTCAtMTIuOTMxIDIuNjk2IFoiIGJ4OnNoYXBlPSJuLWdvbiAtMTEuMzAyIDMuNjM2IDEuODgxIDEuODgxIDYgMCAxQGJhNTE4YjIwIiBzdHlsZT0iZmlsbDogcmdiKDI1NSwgMjU1LCAyNTUpOyBzdHJva2Utd2lkdGg6IDAuNTg3OyIvPgogICAgPHBhdGggZD0iTSAtMS43MDggMi4yNyBIIDEuMDk2IEwgMS4wOTYgMS45ODMgTCAxLjg0OSAyLjQzMSBMIDEuMDk2IDIuODc5IEwgMS4wOTYgMi41OTMgSCAtMS43MDggViAyLjI3IFoiIGJ4OnNoYXBlPSJhcnJvdyAtMS43MDggMS45ODMgMy41NTcgMC44OTYgMC4zMjMgMC43NTMgMCAxQDE1YWRlNzZkIiBzdHlsZT0iZmlsbDogcmdiKDI1NSwgMjU1LCAyNTUpOyBzdHJva2Utd2lkdGg6IDAuNTg3OyB0cmFuc2Zvcm0tb3JpZ2luOiAwLjA3cHggMi40MzFweDsiIHRyYW5zZm9ybT0ibWF0cml4KDAuODY2MDI1LCAwLjUsIC0wLjQ5OTIyNCwgMC44NjY0NzQsIC05LjkyNzk2OSwgMi4wMDI2MjYpIi8+CiAgICA8cGF0aCBkPSJNIC0xLjcwOCAyLjI3IEggMS4wOTYgTCAxLjA5NiAxLjk4MyBMIDEuODQ5IDIuNDMxIEwgMS4wOTYgMi44NzkgTCAxLjA5NiAyLjU5MyBIIC0xLjcwOCBWIDIuMjcgWiIgYng6c2hhcGU9ImFycm93IC0xLjcwOCAxLjk4MyAzLjU1NyAwLjg5NiAwLjMyMyAwLjc1MyAwIDFAMTVhZGU3NmQiIHN0eWxlPSJmaWxsOiByZ2IoMjU1LCAyNTUsIDI1NSk7IHN0cm9rZS13aWR0aDogMC41ODc7IHRyYW5zZm9ybS1vcmlnaW46IDAuMDdweCAyLjQzMXB4OyIgdHJhbnNmb3JtPSJtYXRyaXgoLTAuODY2MDI1LCAwLjUsIDAuNDk5MjI0LCAwLjg2NjQ3NCwgLTEyLjc0MTk3OSwgMi4wMTc1NSkiLz4KICA8L2c+CiAgPGcgdHJhbnNmb3JtPSJtYXRyaXgoMS40NjMyNzQwMDIwNzUxOTUzLCAwLCAwLCAxLjQ2MzI3NDAwMjA3NTE5NTMsIC0yLjU1NjgyOTk2NzQ1MTU0MTYsIC02LjQzMTQ3MDAxMzEzMzczMykiIHN0eWxlPSIiPgogICAgPHBhdGggZD0iTSAtMS43MDggMi4yNyBIIDEuMDk2IEwgMS4wOTYgMS45ODMgTCAxLjg0OSAyLjQzMSBMIDEuMDk2IDIuODc5IEwgMS4wOTYgMi41OTMgSCAtMS43MDggViAyLjI3IFoiIGJ4OnNoYXBlPSJhcnJvdyAtMS43MDggMS45ODMgMy41NTcgMC44OTYgMC4zMjMgMC43NTMgMCAxQDE1YWRlNzZkIiBzdHlsZT0iZmlsbDogcmdiKDI1NSwgMjU1LCAyNTUpOyBzdHJva2Utd2lkdGg6IDAuNTg3OyIgdHJhbnNmb3JtPSJtYXRyaXgoMCwgLTEsIDEsIC0wLjAwMDg5NiwgNS40OTc0MjYsIDEzLjA0NjU4MSkiLz4KICAgIDxwYXRoIGQ9Ik0gMTAuMTE5IDExLjM2MiBMIDExLjc0OCAxMi4zMDMgTCAxMS43NDggMTQuMTg0IEwgMTAuMTE5IDE1LjEyNCBMIDguNDkgMTQuMTg0IEwgOC40OSAxMi4zMDMgWiIgYng6c2hhcGU9Im4tZ29uIDEwLjExOSAxMy4yNDMgMS44ODEgMS44ODEgNiAwIDFAZjZkYjFlMGUiIHN0eWxlPSJmaWxsOiByZ2IoMjU1LCAyNTUsIDI1NSk7IHN0cm9rZS13aWR0aDogMC41ODc7Ii8+CiAgICA8cGF0aCBkPSJNIC0xLjcwOCAyLjI3IEggMS4wOTYgTCAxLjA5NiAxLjk4MyBMIDEuODQ5IDIuNDMxIEwgMS4wOTYgMi44NzkgTCAxLjA5NiAyLjU5MyBIIC0xLjcwOCBWIDIuMjcgWiIgYng6c2hhcGU9ImFycm93IC0xLjcwOCAxLjk4MyAzLjU1NyAwLjg5NiAwLjMyMyAwLjc1MyAwIDFAMTVhZGU3NmQiIHN0eWxlPSJmaWxsOiByZ2IoMjU1LCAyNTUsIDI1NSk7IHN0cm9rZS13aWR0aDogMC41ODc7IHRyYW5zZm9ybS1ib3g6IGZpbGwtYm94OyB0cmFuc2Zvcm0tb3JpZ2luOiA1MCUgNTAlOyIgdHJhbnNmb3JtPSJtYXRyaXgoMC44NjYwMjUsIDAuNSwgLTAuNDk5MjI0LCAwLjg2NjQ3NCwgMTEuNDA0Mjc4LCA5LjE0MDM2OSkiLz4KICAgIDxwYXRoIGQ9Ik0gMS43MDggLTEuNjk3IEggNC41MTIgTCA0LjUxMiAtMS45ODMgTCA1LjI2NSAtMS41MzUgTCA0LjUxMiAtMS4wODcgTCA0LjUxMiAtMS4zNzQgSCAxLjcwOCBWIC0xLjY5NyBaIiBieDpzaGFwZT0iYXJyb3cgMS43MDggLTEuOTgzIDMuNTU3IDAuODk2IDAuMzIzIDAuNzUzIDAgMUA0YzFiNjg0OSIgc3R5bGU9ImZpbGw6IHJnYigyNTUsIDI1NSwgMjU1KTsgc3Ryb2tlLXdpZHRoOiAwLjU4NzsgdHJhbnNmb3JtLW9yaWdpbjogMy40ODdweCAtMS41MzVweDsiIHRyYW5zZm9ybT0ibWF0cml4KC0wLjg2NjAyNSwgMC41LCAwLjQ5OTIyNCwgMC44NjY0NzQsIDcuNDMxNzcxLCAxNi43NzYxNzgpIi8+CiAgPC9nPgo8L3N2Zz4=';

    const VECTOR_COLOR = {
        color1: '#3cc66f',
        color2: '#2ea06f',
        color3: '#2ea06f'
    };

    const QUATERNION_COLOR = {
        color1: '#9534d2',
        color2: '#7027c3',
        color3: '#7027c3'
    };

    Scratch.BlockShapes.register('dragoLeaf', {
        edgeWidth: totalHeight => Math.min(totalHeight / 2, 32),
        leftEdge(steps, width, halfStraight) {
            steps.push(`c ${-2 / 3 * width} 0 ${-width} ${-1 / 3 * width} ${-width} ${-width}`);
            steps.push(`v ${-2 * halfStraight}`);
            steps.push(`v ${-2 / 3 * width}`);
            steps.push(`c 0 ${-.7 / 3 * width} ${.1 * width} ${-1 / 3 * width} ${1 / 3 * width} ${-1 / 3 * width}`);
            steps.push(`h ${2 / 3 * width}`);
        },
        padding: () => 15
    });

    Scratch.BlockShapes.register('dragoBumped', {
        edgeWidth: totalHeight => Math.min(totalHeight / 2, 32),
        leftEdge(steps, width, halfStraight) {
            steps.push(`h ${-2 / 3 * width}`);
            steps.push(`a ${1 / 3 * width} ${1 / 3 * width} 0 0 1 0 ${-width}`);
            steps.push(`v ${-2 * halfStraight}`);
            steps.push(`a ${1 / 3 * width} ${1 / 3 * width} 0 0 1 0 ${-width}`);
            steps.push(`h ${2 / 3 * width}`);
        },
        rightEdge(steps, width, halfStraight) {
            steps.push(`h ${2 / 3 * width}`);
            steps.push(`a ${1 / 3 * width} ${1 / 3 * width} 0 0 1 0 ${width}`);
            steps.push(`v ${2 * halfStraight}`);
            steps.push(`a ${1 / 3 * width} ${1 / 3 * width} 0 0 1 0 ${width}`);
            steps.push(`h ${-2 / 3 * width}`);
        },
        padding: () => 15
    });

    class Vector3DType {
        customId = 'divVector3D';

        constructor(x = 0, y = 0, z = 0) {
            this.x = Cast.toNumber(x);
            this.y = Cast.toNumber(y);
            this.z = Cast.toNumber(z);
        }

        static get shape() {
            return 'dragoLeaf';
        }

        static cast(value) {
            return Vector3DType.toVector3D(value);
        }

        static fromJSON(value) {
            return new Vector3DType(value[0], value[1], value[2]);
        }

        static toVector3D(value) {
            if (value instanceof Vector3DType) return value;
            return new Vector3DType();
        }

        static fromVector(value) {
            const vector = Cast.toFloat32Array(value);
            return new Vector3DType(vector[0], vector[1], vector[2]);
        }

        toString() {
            return `(${formatNumber(this.x)}, ${formatNumber(this.y)}, ${formatNumber(this.z)})`;
        }

        toJSON() {
            return [this.x, this.y, this.z];
        }

        get isNaN() {
            return Number.isNaN(this.x + this.y + this.z);
        }

        getComp(component) {
            switch (component) {
                case 'x': return this.x;
                case 'y': return this.y;
                case 'z': return this.z;
                default: return 0;
            }
        }

        add(rhs) {
            return new Vector3DType(this.x + rhs.x, this.y + rhs.y, this.z + rhs.z);
        }

        sub(rhs) {
            return new Vector3DType(this.x - rhs.x, this.y - rhs.y, this.z - rhs.z);
        }

        dot(rhs) {
            return this.x * rhs.x + this.y * rhs.y + this.z * rhs.z;
        }

        cross(rhs) {
            return new Vector3DType(
                this.y * rhs.z - this.z * rhs.y,
                this.z * rhs.x - this.x * rhs.z,
                this.x * rhs.y - this.y * rhs.x
            );
        }

        get magsq() {
            return this.x * this.x + this.y * this.y + this.z * this.z;
        }

        scale(scalar) {
            return new Vector3DType(this.x * scalar, this.y * scalar, this.z * scalar);
        }

        get norm() {
            const magnitudeSquared = this.magsq;
            if (magnitudeSquared == 0) return this;
            return this.scale(1 / Math.sqrt(magnitudeSquared));
        }

        project(target) {
            return target.scale(this.dot(target) / target.magsq);
        }

        reject(target) {
            return target.scale(-this.dot(target) / target.magsq).add(this);
        }

        static visualReport(vector) {
            const root = document.createElement('div');
            root.style.display = 'flex';
            root.style.minWidth = '190px';
            root.style.overflow = 'hidden';
            root.style.padding = '2px';

            const details = document.createElement('div');
            details.style.display = 'flex';
            details.style.flexDirection = 'column';
            details.style.justifyContent = 'center';
            details.style.minWidth = '70px';
            details.style.paddingRight = '3px';
            details.appendChild(span(`<b>X:</b> ${formatNumber(vector.x)}`));
            details.appendChild(span(`<b>Y:</b> ${formatNumber(vector.y)}`));
            details.appendChild(span(`<b>Z:</b> ${formatNumber(vector.z)}`));
            root.appendChild(details);

            const [scene, world] = mk3DScene();
            if (!vector.isNaN && vector.magsq > 0) {
                const {x, y, z} = vector.norm.scale(40);
                world.appendChild(mkVector(x, y, z, 'var(--text-primary)'));
            }

            root.appendChild(scene);
            return root.outerHTML;
        }
    }

    class QuaternionType {
        customId = 'divQuaternion';

        constructor(r = 0, yz = 0, xz = 0, xy = 0) {
            this.r = Cast.toNumber(r);
            this.yz = Cast.toNumber(yz);
            this.xz = Cast.toNumber(xz);
            this.xy = Cast.toNumber(xy);
        }

        static get shape() {
            return 'dragoBumped';
        }

        static cast(value) {
            return QuaternionType.toQuat(value);
        }

        static fromJSON(value) {
            return new QuaternionType(value[0], value[1], value[2], value[3]);
        }

        static toQuat(value) {
            if (value instanceof QuaternionType) return value;
            return new QuaternionType();
        }

        static fromVector(value) {
            const vector = Cast.toFloat32Array(value);
            return new QuaternionType(vector[0], vector[1], vector[2], vector[3]);
        }

        static withVec(real, vector) {
            return new QuaternionType(real, vector.x, vector.y, vector.z);
        }

        static aroundAxis(axis, angle) {
            if (axis.magsq === 0) return new QuaternionType();
            if (angle === 0) return new QuaternionType(1);
            angle *= Math.PI / 180;
            return QuaternionType.withVec(Math.cos(angle / 2), axis.norm.scale(Math.sin(angle / 2)));
        }

        static fromSpan(vector1, vector2) {
            const real = vector1.dot(vector2);
            const imaginary = vector1.cross(vector2);
            return QuaternionType.withVec(real, imaginary);
        }

        toString() {
            return `${formatNumber(this.r)} + ${formatNumber(this.yz)} 𝒊 + ${formatNumber(this.xz)} 𝑗 + ${formatNumber(this.xy)} 𝑘`;
        }

        toJSON() {
            return [this.r, this.yz, this.xz, this.xy];
        }

        get isNaN() {
            return Number.isNaN(this.r + this.yz + this.xz + this.xy);
        }

        add(rhs) {
            return new QuaternionType(
                this.r + rhs.r,
                this.yz + rhs.yz,
                this.xz + rhs.xz,
                this.xy + rhs.xy
            );
        }

        sub(rhs) {
            return new QuaternionType(
                this.r - rhs.r,
                this.yz - rhs.yz,
                this.xz - rhs.xz,
                this.xy - rhs.xy
            );
        }

        mult(rhs) {
            return new QuaternionType(
                this.r * rhs.r - this.yz * rhs.yz - this.xz * rhs.xz - this.xy * rhs.xy,
                this.r * rhs.yz + this.yz * rhs.r + this.xz * rhs.xy - this.xy * rhs.xz,
                this.r * rhs.xz - this.yz * rhs.xy + this.xz * rhs.r + this.xy * rhs.yz,
                this.r * rhs.xy + this.yz * rhs.xz - this.xz * rhs.yz + this.xy * rhs.r
            );
        }

        get magsq() {
            return this.r * this.r + this.yz * this.yz + this.xz * this.xz + this.xy * this.xy;
        }

        scale(scalar) {
            return new QuaternionType(
                this.r * scalar,
                this.yz * scalar,
                this.xz * scalar,
                this.xy * scalar
            );
        }

        get norm() {
            const magnitudeSquared = this.magsq;
            if (magnitudeSquared == 0) return this;
            return this.scale(1 / Math.sqrt(magnitudeSquared));
        }

        get imag() {
            return new Vector3DType(this.yz, this.xz, this.xy);
        }

        get conj() {
            return new QuaternionType(this.r, -this.yz, -this.xz, -this.xy);
        }

        get inv() {
            return this.conj.scale(1 / this.magsq);
        }

        get sqrt() {
            const magnitude = Math.sqrt(this.magsq);
            if (magnitude + this.r === 0) return new QuaternionType(0, magnitude, 0, 0);
            return this.add(new QuaternionType(magnitude, 0, 0, 0)).norm.scale(Math.sqrt(magnitude));
        }

        transform(vector) {
            return this.mult(QuaternionType.withVec(0, vector)).mult(this.inv).imag;
        }

        get angle() {
            return Math.atan2(Math.sqrt(this.imag.magsq), this.r);
        }

        get exp() {
            if (this.r === Number.NEGATIVE_INFINITY) return new QuaternionType();
            const vector = this.imag;
            const alpha = Math.sqrt(vector.magsq);
            return QuaternionType.withVec(
                Math.cos(alpha),
                vector.norm.scale(Math.sin(alpha))
            ).scale(Math.exp(this.r));
        }

        get log() {
            if (this.magsq === 0) return new QuaternionType(Number.NEGATIVE_INFINITY, 0, 0, 0);
            return QuaternionType.withVec(Math.log(this.magsq) / 2, this.imag.norm.scale(this.angle));
        }

        static visualReport(quaternion) {
            const root = document.createElement('div');
            root.style.display = 'flex';
            root.style.minWidth = '190px';
            root.style.overflow = 'hidden';
            root.style.padding = '2px';
            root.style.flexDirection = 'column';

            const top = document.createElement('div');
            top.style.display = 'flex';
            top.style.padding = '4px';
            top.style.height = '120px';

            const details = document.createElement('div');
            details.style.display = 'flex';
            details.style.flexDirection = 'column';
            details.style.justifyContent = 'center';
            details.style.minWidth = '70px';
            details.style.paddingRight = '3px';
            details.appendChild(span(`<b>1:</b> ${formatNumber(quaternion.r)}`));
            details.appendChild(span(`<b>i:</b> ${formatNumber(quaternion.yz)}`));
            details.appendChild(span(`<b>j:</b> ${formatNumber(quaternion.xz)}`));
            details.appendChild(span(`<b>k:</b> ${formatNumber(quaternion.xy)}`));
            top.appendChild(details);

            const [scene, world] = mk3DScene(true);
            const {yz, xz, xy} = quaternion.norm.scale(40);
            let angle = 0;

            if (!quaternion.isNaN && quaternion.imag.magsq > 0) {
                world.appendChild(mkVector(yz, xz, xy, 'var(--text-primary)'));
                const plane = mkPlane(yz, xz, xy);
                world.appendChild(plane);

                const arc = document.createElement('div');
                arc.className = 'divVecQuatArc';
                angle = quaternion.angle * 2;
                arc.style.setProperty('--angle', `${angle}rad`);

                const arrow = document.createElement('div');
                arrow.className = 'divVecQuatArcArrow';
                arrow.style.transform = `translate(${-45 + Math.sin(angle) * 56 / 2}px, ${45 - Math.cos(angle) * 56 / 2}px) rotate(${angle}rad) translate(-2px)`;
                plane.appendChild(arc);
                plane.appendChild(arrow);
            }

            top.appendChild(scene);
            root.appendChild(top);

            const bottom = document.createElement('div');
            bottom.style.display = 'flex';
            bottom.style.flexDirection = 'column';
            bottom.style.justifyContent = 'center';
            bottom.style.padding = '4px';
            bottom.appendChild(span(`<b>angle:</b> ${Math.round(angle * 180 / Math.PI)}°`));
            root.appendChild(bottom);

            return root.outerHTML;
        }
    }

    const divVecQuat = {
        Vector: {
            Type: Vector3DType,
            Color: VECTOR_COLOR,
            Argument: {type: 'divVector3D'}
        },
        Quat: {
            Type: QuaternionType,
            Color: QUATERNION_COLOR,
            Argument: {type: 'divQuaternion'}
        }
    };

    vm.divVecQuat = divVecQuat;

    Scratch.types.register('divVector3D', Vector3DType);
    Scratch.types.register('divQuaternion', QuaternionType);

    function initStyle() {
        const style = document.createElement('style');
        style.id = 'divVecQuatStyle';
        style.textContent = `
            .divVecQuatScene {
                width: 120px;
                height: 120px;
                display: inline-flex;
                justify-content: center;
                align-items: center;
                background-color: #5552;
                border-radius: 4px;
                perspective: 800px;
            }
            .divVecQuatWorld {
                position: relative;
                width: 0;
                height: 0;
                transform-style: preserve-3d;
                animation: divVecQuatSpinWorld var(--duration) linear infinite;
                transition: transform .25s ease-out, animation .2s ease-out;
            }
            .divVecQuatScene:hover > .divVecQuatWorld {
                animation: none;
                transform: perspective(20cm) rotateX(var(--my)) rotateZ(var(--mx));
            }
            @keyframes divVecQuatSpinWorld {
                from { transform: perspective(20cm) rotateX(var(--tilt)) rotateZ(-45deg); }
                to { transform: perspective(20cm) rotateX(var(--tilt)) rotateZ(315deg); }
            }
            .divVecQuatLine {
                position: absolute;
                top: -1px;
                height: 2px;
                background-color: currentColor;
                transform-style: preserve-3d;
            }
            .divVecQuatLine::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: currentColor;
                transform: rotateX(90deg);
            }
            .divVecQuatArrow {
                position: absolute;
                left: 100%;
                top: -4px;
                width: 0;
                height: 0;
                border-left: 10px solid currentColor;
                border-top: 5px solid transparent;
                border-bottom: 5px solid transparent;
                transform-style: preserve-3d;
            }
            .divVecQuatArrow::before {
                content: '';
                position: absolute;
                left: -10px;
                top: -5px;
                width: 0;
                height: 0;
                border-left: 10px solid currentColor;
                border-top: 5px solid transparent;
                border-bottom: 5px solid transparent;
                transform: rotateX(90deg);
            }
            .divVecQuatAxis {
                left: -45px;
                width: 90px;
                transform-origin: 50% 1px;
            }
            .divVecQuatVector {
                left: 0;
                transform-origin: 0 1px;
            }
            .divVecQuatPlane {
                display: flex;
                justify-content: center;
                align-items: center;
                position: absolute;
                left: -45px;
                top: -45px;
                width: 90px;
                height: 90px;
                transform-origin: center;
                background-color: currentColor;
                transform-style: preserve-3d;
            }
            .divVecQuatArc {
                width: 60px;
                aspect-ratio: 1;
                padding: 4px;
                box-sizing: border-box;
                border-radius: 50%;
                background: #fff;
                transform-style: preserve-3d;
                mask:
                    linear-gradient(#0000 0 0) content-box intersect,
                    conic-gradient(#000 var(--angle), #0000 0);
            }
            .divVecQuatArcArrow {
                position: absolute;
                left: 100%;
                top: -4px;
                width: 0;
                height: 0;
                border-left: 10px solid #fff;
                border-top: 5px solid transparent;
                border-bottom: 5px solid transparent;
                transform-style: preserve-3d;
                transform-origin: 0% 50%;
            }
        `;
        return style;
    }

    function installVisuals() {
        const previousStyle = document.getElementById('divVecQuatStyle');
        const style = initStyle();
        if (previousStyle) previousStyle.replaceWith(style);
        else document.head.appendChild(style);

        if (document.documentElement.dataset.divVecQuatMouseTracking) return;
        document.documentElement.dataset.divVecQuatMouseTracking = 'true';
        document.addEventListener('mousemove', event => {
            const scene = event.target.closest?.('.divVecQuatScene');
            if (!scene) return;

            const world = scene.firstElementChild;
            const {x, y, width, height} = scene.getBoundingClientRect();
            const mouseX = 2 * (event.clientX - x) / width - 1;
            const mouseY = 2 * (event.clientY - y) / height - 1;
            world.style.setProperty('--mx', `${-mouseX * 90}deg`);
            world.style.setProperty('--my', `${(-mouseY + 1) * 90}deg`);
        });
    }

    function mk3DScene(quaternion = false) {
        const scene = document.createElement('div');
        scene.className = 'divVecQuatScene';

        const world = document.createElement('div');
        world.className = 'divVecQuatWorld';
        world.style.setProperty('--tilt', '60deg');
        world.style.setProperty('--duration', '15s');
        scene.appendChild(world);

        const xColor = quaternion ? '#FF4472' : '#FF4338';
        const yColor = quaternion ? '#7236FF' : '#7B77F1';
        const zColor = quaternion ? '#00FFB3' : '#22FF72';
        world.appendChild(createAxis(xColor, 0, 0));
        world.appendChild(createAxis(yColor, 0, 90));
        world.appendChild(createAxis(zColor, -90, 0));

        const xyPlane = document.createElement('div');
        xyPlane.className = 'divVecQuatPlane';
        xyPlane.style.color = '#5552';
        world.appendChild(xyPlane);

        return [scene, world];
    }

    function createAxis(color, rotateY, rotateZ) {
        const axis = document.createElement('div');
        axis.className = 'divVecQuatLine divVecQuatAxis';
        axis.style.color = color;
        axis.style.transform = `rotateZ(${rotateZ}deg) rotateY(${rotateY}deg)`;

        const arrow = document.createElement('div');
        arrow.className = 'divVecQuatArrow';
        axis.appendChild(arrow);
        return axis;
    }

    function mkVector(x, y, z, color) {
        const vector = document.createElement('div');
        vector.className = 'divVecQuatLine divVecQuatVector';
        vector.style.color = color;

        const length = Math.hypot(x, y, z);
        const xyLength = Math.hypot(x, y);
        const rotateZ = Math.atan2(y, x);
        const rotateY = Math.atan2(-z, xyLength);

        vector.style.width = `${length}px`;
        vector.style.transform = `rotateZ(${rotateZ}rad) rotateY(${rotateY}rad)`;

        const arrow = document.createElement('div');
        arrow.className = 'divVecQuatArrow';
        vector.appendChild(arrow);
        return vector;
    }

    function mkPlane(yz, xz, xy) {
        const plane = document.createElement('div');
        plane.className = 'divVecQuatPlane';
        plane.style.color = '#9307FF52';

        const xyLength = Math.hypot(yz, xz);
        const rotateZ = Math.atan2(xz, yz);
        const rotateY = Math.atan2(-xy, xyLength) + Math.PI / 2;
        plane.style.transform = `rotateZ(${rotateZ}rad) rotateY(${rotateY}rad)`;
        return plane;
    }

    function vectorReporter(opcode, text, arguments_, color = VECTOR_COLOR) {
        return {
            opcode,
            blockType: BlockType.REPORTER,
            text,
            outputType: 'divVector3D',
            blockShape: 'dragoLeaf',
            allowDropAnywhere: true,
            disableMonitor: true,
            arguments: arguments_,
            ...color
        };
    }

    function quaternionReporter(opcode, text, arguments_) {
        return {
            opcode,
            blockType: BlockType.REPORTER,
            text,
            outputType: 'divQuaternion',
            blockShape: 'dragoBumped',
            allowDropAnywhere: true,
            disableMonitor: true,
            arguments: arguments_,
            ...QUATERNION_COLOR
        };
    }

    function numberReporter(opcode, text, arguments_, color) {
        return {
            opcode,
            blockType: BlockType.REPORTER,
            text,
            arguments: arguments_,
            ...color
        };
    }

    const numberInput = defaultValue => ({
        type: ArgumentType.NUMBER,
        defaultValue
    });

    const vectorInput = {type: 'divVector3D'};
    const quaternionInput = {type: 'divQuaternion'};

    class Extension {
        constructor() {
            installVisuals();
        }

        getInfo() {
            return {
                id: 'divVecQuat',
                name: '3D Vectors & Quats',
                menuIconURI,
                color1: VECTOR_COLOR.color1,
                color2: VECTOR_COLOR.color2,
                color3: VECTOR_COLOR.color3,
                useUnsandboxedRuntime: true,
                blocks: [
                    {
                        blockType: BlockType.LABEL,
                        text: 'Vectors'
                    },
                    vectorReporter('vecNew', 'vector ([X], [Y], [Z])', {
                        X: numberInput(0),
                        Y: numberInput(0),
                        Z: numberInput(0)
                    }),
                    vectorReporter('vecFromVector', 'convert vector [VECTOR] to Vector3', {
                        VECTOR: {
                            type: ArgumentType.ARRAY,
                            defaultValue: [0, 0, 0]
                        }
                    }),
                    vectorReporter('vecComp', 'get [COMP] of [V]', {
                        COMP: {
                            type: ArgumentType.STRING,
                            menu: 'vecComp',
                            defaultValue: 'x'
                        },
                        V: vectorInput
                    }),
                    '---',
                    vectorReporter('vecAdd', '[V1] + [V2]', {
                        V1: vectorInput,
                        V2: vectorInput
                    }),
                    vectorReporter('vecSub', '[V1] - [V2]', {
                        V1: vectorInput,
                        V2: vectorInput
                    }),
                    vectorReporter('vecScale', '[V] * [S]', {
                        V: vectorInput,
                        S: numberInput(2)
                    }),
                    numberReporter('vecDot', '[V1] ⋅ [V2]', {
                        V1: vectorInput,
                        V2: vectorInput
                    }, VECTOR_COLOR),
                    vectorReporter('vecCross', '[V1] × [V2]', {
                        V1: vectorInput,
                        V2: vectorInput
                    }),
                    '---',
                    numberReporter('vecMagSq', '‖[V]‖²', {
                        V: vectorInput
                    }, VECTOR_COLOR),
                    vectorReporter('vecNorm', 'normalize [V]', {
                        V: vectorInput
                    }),
                    '---',
                    vectorReporter('vecProject', 'project [V1] onto [V2]', {
                        V1: vectorInput,
                        V2: vectorInput
                    }),
                    vectorReporter('vecReject', 'reject [V1] from [V2]', {
                        V1: vectorInput,
                        V2: vectorInput
                    }),
                    {
                        blockType: BlockType.LABEL,
                        text: 'Quaternions'
                    },
                    quaternionReporter('quatNew', 'quaternion [R] + [YZ] i + [XZ] j + [XY] k', {
                        R: numberInput(1),
                        YZ: numberInput(0),
                        XZ: numberInput(0),
                        XY: numberInput(0)
                    }),
                    quaternionReporter('quatFromVector', 'convert vector [VECTOR] to Quaternion', {
                        VECTOR: {
                            type: ArgumentType.ARRAY,
                            defaultValue: [1, 0, 0, 0]
                        }
                    }),
                    quaternionReporter('quatWithVec', 'quaternion real: [R] imag: [VEC]', {
                        R: numberInput(1),
                        VEC: vectorInput
                    }),
                    quaternionReporter('quatAround', 'quaternion axis: [AXIS] angle: [ANGLE]', {
                        AXIS: vectorInput,
                        ANGLE: numberInput(90)
                    }),
                    '---',
                    numberReporter('quatReal', 'real of [Q]', {
                        Q: quaternionInput
                    }, QUATERNION_COLOR),
                    vectorReporter('quatImag', 'imag of [Q]', {
                        Q: quaternionInput
                    }, QUATERNION_COLOR),
                    '---',
                    vectorReporter('quatTransform', 'apply [Q] on [V]', {
                        Q: quaternionInput,
                        V: vectorInput
                    }, QUATERNION_COLOR),
                    quaternionReporter('quatSpan', 'from [V1] to [V2]', {
                        V1: vectorInput,
                        V2: vectorInput
                    }),
                    '---',
                    quaternionReporter('quatAdd', '[Q1] + [Q2]', {
                        Q1: quaternionInput,
                        Q2: quaternionInput
                    }),
                    quaternionReporter('quatSub', '[Q1] - [Q2]', {
                        Q1: quaternionInput,
                        Q2: quaternionInput
                    }),
                    quaternionReporter('quatScale', '[Q] * [S]', {
                        Q: quaternionInput,
                        S: numberInput(2)
                    }),
                    quaternionReporter('quatMult', '[Q1] * [Q2]', {
                        Q1: quaternionInput,
                        Q2: quaternionInput
                    }),
                    quaternionReporter('quatInv', '1 / [Q]', {
                        Q: quaternionInput
                    }),
                    '---',
                    numberReporter('quatMagSq', '‖[Q]‖²', {
                        Q: quaternionInput
                    }, QUATERNION_COLOR),
                    quaternionReporter('quatNorm', 'normalize [Q]', {
                        Q: quaternionInput
                    }),
                    quaternionReporter('quatConj', 'conjugate [Q]', {
                        Q: quaternionInput
                    }),
                    '---',
                    quaternionReporter('quatSqrt', '√[Q]', {
                        Q: quaternionInput
                    }),
                    quaternionReporter('quatExp', 'exp([Q])', {
                        Q: quaternionInput
                    }),
                    quaternionReporter('quatLog', 'log([Q])', {
                        Q: quaternionInput
                    })
                ],
                menus: {
                    vecComp: {
                        acceptReporters: true,
                        items: [
                            {text: 'x', value: 'x'},
                            {text: 'y', value: 'y'},
                            {text: 'z', value: 'z'}
                        ]
                    }
                }
            };
        }

        vecNew({X, Y, Z}) {
            return new Vector3DType(X, Y, Z);
        }

        vecFromVector({VECTOR}) {
            return Vector3DType.fromVector(VECTOR);
        }

        vecComp({COMP, V}) {
            return Vector3DType.toVector3D(V).getComp(Cast.toString(COMP));
        }

        vecAdd({V1, V2}) {
            return Vector3DType.toVector3D(V1).add(Vector3DType.toVector3D(V2));
        }

        vecSub({V1, V2}) {
            return Vector3DType.toVector3D(V1).sub(Vector3DType.toVector3D(V2));
        }

        vecScale({V, S}) {
            return Vector3DType.toVector3D(V).scale(Cast.toNumber(S));
        }

        vecDot({V1, V2}) {
            return Vector3DType.toVector3D(V1).dot(Vector3DType.toVector3D(V2));
        }

        vecCross({V1, V2}) {
            return Vector3DType.toVector3D(V1).cross(Vector3DType.toVector3D(V2));
        }

        vecMagSq({V}) {
            return Vector3DType.toVector3D(V).magsq;
        }

        vecNorm({V}) {
            return Vector3DType.toVector3D(V).norm;
        }

        vecProject({V1, V2}) {
            return Vector3DType.toVector3D(V1).project(Vector3DType.toVector3D(V2));
        }

        vecReject({V1, V2}) {
            return Vector3DType.toVector3D(V1).reject(Vector3DType.toVector3D(V2));
        }

        quatNew({R, YZ, XZ, XY}) {
            return new QuaternionType(R, YZ, XZ, XY);
        }

        quatFromVector({VECTOR}) {
            return QuaternionType.fromVector(VECTOR);
        }

        quatWithVec({R, VEC}) {
            return QuaternionType.withVec(Cast.toNumber(R), Vector3DType.toVector3D(VEC));
        }

        quatAround({AXIS, ANGLE}) {
            return QuaternionType.aroundAxis(Vector3DType.toVector3D(AXIS), Cast.toNumber(ANGLE));
        }

        quatReal({Q}) {
            return QuaternionType.toQuat(Q).r;
        }

        quatImag({Q}) {
            return QuaternionType.toQuat(Q).imag;
        }

        quatTransform({Q, V}) {
            return QuaternionType.toQuat(Q).transform(Vector3DType.toVector3D(V));
        }

        quatSpan({V1, V2}) {
            return QuaternionType.fromSpan(
                Vector3DType.toVector3D(V1),
                Vector3DType.toVector3D(V2)
            ).sqrt;
        }

        quatAdd({Q1, Q2}) {
            return QuaternionType.toQuat(Q1).add(QuaternionType.toQuat(Q2));
        }

        quatSub({Q1, Q2}) {
            return QuaternionType.toQuat(Q1).sub(QuaternionType.toQuat(Q2));
        }

        quatScale({Q, S}) {
            return QuaternionType.toQuat(Q).scale(Cast.toNumber(S));
        }

        quatMult({Q1, Q2}) {
            return QuaternionType.toQuat(Q1).mult(QuaternionType.toQuat(Q2));
        }

        quatInv({Q}) {
            return QuaternionType.toQuat(Q).inv;
        }

        quatMagSq({Q}) {
            return QuaternionType.toQuat(Q).magsq;
        }

        quatNorm({Q}) {
            return QuaternionType.toQuat(Q).norm;
        }

        quatConj({Q}) {
            return QuaternionType.toQuat(Q).conj;
        }

        quatSqrt({Q}) {
            return QuaternionType.toQuat(Q).sqrt;
        }

        quatExp({Q}) {
            return QuaternionType.toQuat(Q).exp;
        }

        quatLog({Q}) {
            return QuaternionType.toQuat(Q).log;
        }
    }

    Scratch.extensions.register(new Extension());
})(Scratch);
