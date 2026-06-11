/* ============================================================
   SurfGoose · DESIGN LAB — motion + rendering
   Standalone: loads the same data pipeline as the live site
   (data.js slug snapshot → api-client.js live API + cache) but
   none of the live UI code. If the animation CDNs fail, the
   page still renders fully — motion is progressive enhancement.
   ============================================================ */

(function () {
  "use strict";

  /* ---------- the goose, as inline vector ----------
     Taken from surfgoose_logo_vector.svg (lab/goose.svg). Inlined so
     we can spawn as many geese as we like with zero extra requests. */
  var GOOSE_PATHS =
    '<path d="M0 0 C2.46 5.11 4.42 10.21 6.12 15.62 C11.98 34.16 11.98 34.16 20.06 38.5 C31.12 43.38 44.86 41.72 56 38 C64.42 34.44 71.07 29.96 74.75 21.38 C76.33 16.7 76.82 11.84 77.38 6.95 C78.04 3.8 78.66 2.21 81 0 C84.13 -0.52 86.99 0.06 90 1 C93.06 3.56 93.06 3.56 95 6 C93.97 5.67 92.94 5.34 91.88 5 C88.52 4.03 85.51 3.83 82 4 C80.41 7.5 79.61 10.83 79.01 14.62 C78.02 20.95 76.82 26.5 73.62 32.12 C72.27 34.52 71.06 36.9 69.88 39.38 C65.1 49.14 60.03 57 52.27 64.63 C50 67 50 67 50 69 C51.65 70.37 51.65 70.37 53.94 72 C57.68 74.79 60.62 77.74 63.62 81.31 C67.24 85.5 69.52 87.3 75 88 C72.63 92.74 63.83 95.18 59 97 C38.16 103.44 14.2 105.65 -5.81 95.81 C-7.55 94.89 -9.28 93.96 -11 93 C-10.37 93.61 -9.74 94.21 -9.09 94.84 C3.37 107.03 10.19 118.41 15.97 134.78 C16.33 135.78 16.68 136.78 17.05 137.81 C17.81 139.94 18.57 142.07 19.33 144.2 C21.32 149.82 23.34 155.43 25.36 161.05 C25.56 161.61 25.56 161.61 26.57 164.43 C41.1 204.99 56.32 244.64 78 282 C78.89 283.55 79.78 285.09 80.67 286.64 C84.7 293.62 88.9 300.45 93.31 307.19 C127.42 359.31 154 420.76 140.96 484.27 C136.85 503 130.3 519.25 121 536 C125.29 536.33 129.58 536.66 134 537 C134 537.33 134 537.66 134 538 C132.35 538 130.7 538 129 538 C129 544.93 129 551.86 129 559 C63.25 560.18 -21.71 549.39 -71.84 503.14 C-75.94 499.18 -79.23 494.98 -82 490 C-82.43 489.25 -82.86 488.5 -83.3 487.73 C-86.79 480.89 -87.13 474.56 -84.81 467.25 C-79.92 458.48 -74.19 455.26 -64.89 451.87 C-59.73 450.72 -54.83 450.79 -49.56 450.88 C-48.54 450.88 -47.53 450.89 -46.48 450.9 C-43.99 450.93 -41.49 450.96 -39 451 C-66.73 437.34 -96.51 432.57 -126.56 441.81 C-137.98 446.01 -148.53 452.86 -154 464 C-157.98 473.93 -156.96 485.84 -153.45 495.79 C-141.74 521.83 -117.13 539.34 -93 553 C-92.32 553.39 -91.65 553.77 -90.95 554.17 C-37.04 584.71 25.03 596.38 86 602 C86 602.33 86 602.66 86 603 C83.69 603.66 81.38 604.32 79 605 C79.33 605.99 79.66 606.98 80 608 C79.56 610.19 79.56 610.19 79 612 C67.64 612.25 56.54 611.54 45.25 610.38 C44.39 610.29 43.53 610.2 42.64 610.11 C16.09 607.4 -10.22 602.98 -36 596 C-36.54 595.85 -36.54 595.85 -39.26 595.12 C-79.59 584.04 -120.91 567.53 -153 540 C-153.52 539.55 -154.05 539.11 -154.59 538.65 C-170.09 525.34 -185.33 507.95 -187.2 486.69 C-187.72 477.52 -187.74 468.54 -184 460 C-183.74 459.33 -183.49 458.67 -183.23 457.98 C-177.55 444.79 -164.51 435.1 -152 429 C-151.12 428.56 -150.24 428.11 -149.33 427.66 C-127.58 417.59 -101.18 417.65 -78 422 C-88.73 415.78 -99.25 410.06 -111 406 C-111.36 405.87 -111.36 405.87 -113.16 405.24 C-166.95 386.52 -226.96 396.71 -277.33 420.95 C-294.48 429.45 -309.19 440.06 -323.86 452.29 C-326 454 -326 454 -328 455 C-328 445.1 -328 435.2 -328 425 C-312.14 416.04 -296.26 407.22 -280 399 C-279.25 398.62 -278.51 398.24 -277.74 397.85 C-255.25 386.55 -231.36 378.86 -206.75 373.75 C-206.03 373.6 -205.31 373.45 -204.57 373.29 C-188.97 370.24 -173.35 369.62 -157.5 369.69 C-156.54 369.69 -155.57 369.69 -154.58 369.69 C-139.21 369.75 -124.17 370.3 -109 373 C-107.96 373.18 -106.92 373.37 -105.84 373.55 C-59.37 382.06 -15.41 401.84 21 432 C22.01 432.82 23.01 433.64 24.05 434.48 C32.19 441.19 39.65 448.44 47 456 C33.2 418.21 -2.02 389.56 -37.34 372.9 C-41.86 370.84 -46.41 368.89 -51 367 C-50.39 360.7 -49.39 354.63 -48.06 348.44 C-36.99 294.73 -44.72 240.74 -54.7 187.59 C-54.82 186.95 -54.82 186.95 -55.42 183.72 C-56.62 177.35 -57.82 170.98 -59.04 164.61 C-63.11 143.26 -67 121.73 -68.25 100 C-68.32 98.8 -68.4 97.6 -68.48 96.37 C-69.8 73.54 -68.75 51.4 -64 29 C-64.69 29.3 -65.37 29.6 -66.08 29.91 C-66.98 30.29 -67.88 30.67 -68.81 31.06 C-69.26 31.25 -69.26 31.25 -71.52 32.22 C-74 33 -74 33 -77 32 C-66.15 26.18 -54.78 21.72 -43.38 17.12 C-39.57 15.59 -35.76 14.05 -31.96 12.51 C-31.5 12.32 -31.5 12.32 -29.17 11.38 C-22.21 8.54 -15.34 5.54 -8.52 2.38 C-3.32 0 -3.32 0 0 0 Z" fill="#FCF9F4" transform="translate(495,153)"/>' +
    '<path d="M0 0 C11.97 2.18 23.09 0.11 34.86 -2.21 C46.79 -4.54 62.8 -7.16 73.98 -1.12 C76.37 0.69 77.84 2.43 79 5.19 C79 7.81 79 7.81 78.02 10.93 C76.77 15.14 76.71 19.19 76.62 23.56 C76.39 30.14 75.55 35.57 72.84 41.65 C72 43.81 72 43.81 72 47.81 C80.34 52.63 88.7 56.61 97.75 59.94 C120.35 68.31 120.35 68.31 126.44 80.75 C127.21 84.94 127.09 88.68 126 92.81 C123.77 95.82 121.45 97.44 118 98.81 C115.03 98.89 115.03 98.89 111.61 98.73 C104.05 98.62 97.55 100.09 90.31 102.12 C74.31 106.36 74.31 106.36 66.19 107.62 C65.45 107.74 64.71 107.86 63.95 107.98 C59.76 108.58 55.63 108.9 51.39 109.04 C40 109.51 32.02 110.93 22.45 117.3 C17.81 120.35 13.41 122.51 8.14 124.3 C7.55 124.51 7.55 124.51 4.56 125.52 C2.24 126.28 -0.1 127 -2.46 127.67 C-5.74 128.76 -8.24 129.71 -11 131.81 C-12.97 136.07 -13.57 140.17 -14 144.81 C-14.13 145.88 -14.25 146.95 -14.38 148.05 C-17.83 179.91 -12.23 212.39 -3 242.81 C-2.75 243.63 -2.51 244.44 -2.26 245.29 C4.88 268.48 16.11 289.98 30 309.81 C30.29 310.23 30.29 310.23 31.76 312.33 C34.13 315.73 36.51 319.13 38.91 322.53 C62.41 355.93 82.59 392.19 90 432.81 C90.15 433.58 90.29 434.35 90.44 435.14 C94.71 458.32 95.1 483.76 90 506.81 C89.82 507.61 89.65 508.42 89.46 509.24 C86.82 520.82 83.33 532.16 78 542.81 C77.84 545.14 77.75 547.46 77.68 549.79 C77.67 550.13 77.67 550.13 77.62 551.87 C77.56 554.06 77.5 556.25 77.44 558.44 C77.39 559.92 77.35 561.41 77.31 562.89 C77.2 566.53 77.1 570.17 77 573.81 C126.3 570.68 174.61 564.25 222 549.81 C222.53 549.65 222.53 549.65 225.19 548.84 C243.04 543.34 259.99 536.2 276.79 528.06 C277.45 527.74 278.11 527.42 278.79 527.09 C282.06 525.5 285.33 523.9 288.59 522.28 C289.78 521.7 290.96 521.12 292.17 520.52 C293.22 520 294.28 519.48 295.36 518.94 C298 517.81 298 517.81 301 517.81 C293.88 524.41 286.67 530.84 279 536.81 C278.35 537.32 277.7 537.82 277.03 538.34 C265.05 547.59 252.54 555.67 239.49 563.34 C237.45 564.55 235.43 565.77 233.41 567.01 C205.18 583.97 172.74 595.55 141 603.81 C139.87 604.11 138.74 604.4 137.58 604.7 C51.29 626.77 -37.81 621.19 -169.58 566.27 C-193.13 552.11 -217.67 533.01 -226 505.81 C-226.1 505.5 -226.1 505.5 -226.6 503.92 C-228.36 494.6 -228.05 484 -223 475.81 C-212.75 461.24 -196.82 455.83 -180 452.81 C-155.02 448.59 -128.93 454.68 -107 466.81 C-109.89 467.65 -112.34 467.89 -115.34 467.77 C-128.13 467.39 -139.12 467.8 -149.45 476.3 C-153.92 480.65 -155.13 485.45 -155.31 491.5 C-155.13 502.62 -147.86 511.92 -140.29 519.54 C-89.95 565.72 -6.16 572.86 59 574.81 C59 567.88 59 560.95 59 553.81 C56.03 553.48 53.06 553.15 50 552.81 C50.25 552.33 50.25 552.33 51.5 549.91 C61.67 530.08 69.46 510.13 72 487.81 C72.11 486.88 72.22 485.95 72.34 484.98 C78.54 423.62 52.01 369.19 19.93 319.01 C12.58 307.48 5.63 295.77 -1 283.81 C-1.41 283.07 -1.83 282.32 -2.25 281.56 C-17.38 254.15 -28.24 224.68 -38.88 195.31 C-39.21 194.38 -39.55 193.46 -39.89 192.5 C-42.93 184.1 -45.96 175.7 -48.98 167.29 C-50.56 162.91 -52.14 158.53 -53.73 154.15 C-54.32 152.53 -54.9 150.91 -55.48 149.29 C-59.96 136.73 -64.86 126.41 -74.31 116.81 C-75.56 115.52 -76.81 114.23 -78.05 112.94 C-78.32 112.66 -78.32 112.66 -79.7 111.26 C-81 109.81 -81 109.81 -82 107.81 C-77.61 109.51 -73.43 111.52 -69.21 113.59 C-49.02 121.27 -24.18 117.05 -4.73 109.06 C-1.78 107.71 1.11 106.28 4 104.81 C3.48 104.63 3.48 104.63 0.84 103.68 C-3.19 101.95 -5.69 99.28 -8.44 95.94 C-12.54 91.19 -16.43 87.75 -22 84.81 C-21.6 84.35 -21.6 84.35 -19.56 82 C-19.01 81.35 -18.47 80.71 -17.9 80.04 C-16.58 78.49 -15.24 76.97 -13.88 75.46 C-7.72 68.4 -3.77 61.02 0.14 52.6 C1.23 50.33 2.5 48.18 3.75 46 C6.58 40.46 7.54 34.39 8.66 28.32 C8.73 27.92 8.73 27.92 9.11 25.91 C9.17 25.55 9.17 25.55 9.49 23.74 C10 21.81 10 21.81 12 18.81 C12.63 18.88 13.25 18.96 13.9 19.03 C14.31 19.08 14.31 19.08 16.38 19.31 C16.78 19.36 16.78 19.36 18.84 19.59 C21 19.81 21 19.81 23 19.81 C18.84 17.43 15.82 16.15 11 16.81 C8.94 19.9 8.56 22.05 8.06 25.66 C6.68 35.67 4.27 42.59 -3.81 49.12 C-15.14 56.89 -27.44 58.84 -41 57.81 C-47.05 56.61 -53.3 54.25 -57.21 49.27 C-61.05 43.37 -63.15 37.18 -65.25 30.5 C-65.6 29.42 -65.95 28.33 -66.31 27.22 C-66.96 25.22 -67.6 23.23 -68.23 21.23 C-68.81 19.42 -69.4 17.61 -70 15.81 C-71.07 16.27 -72.14 16.73 -73.24 17.2 C-108.94 32.44 -108.94 32.44 -125.88 39.44 C-126.43 39.67 -126.43 39.67 -129.25 40.85 C-129.76 41.06 -129.76 41.06 -132.3 42.1 C-133.17 42.46 -134.04 42.82 -134.93 43.19 C-137 43.81 -137 43.81 -139 42.81 C-125.44 26.33 -112.03 18.5 -92.49 10.97 C-87.32 8.98 -82.38 6.68 -77.44 4.19 C-52.91 -7.77 -25.94 -5.23 0 0 Z" fill="#23221E" transform="translate(565,137.1875)"/>' +
    '<path d="M0 0 C0.65 0.22 1.31 0.45 1.98 0.68 C13.68 4.75 24.29 10.87 35 17 C31.42 18.22 28.75 17.77 25.07 17.09 C-1.47 12.69 -30.85 15.98 -53.21 31.8 C-60.84 37.82 -66.95 44.11 -71 53 C-71.31 53.64 -71.61 54.28 -71.93 54.94 C-77.41 66.98 -76.35 82.54 -72.26 94.86 C-68.78 103.54 -64.02 110.88 -58 118 C-57.36 118.78 -56.71 119.56 -56.05 120.36 C-45.73 132.36 -33.37 141.67 -20 150 C-19.38 150.39 -18.76 150.79 -18.12 151.19 C19.3 174.77 62.1 188.79 105.4 196.71 C106.1 196.84 106.8 196.97 107.53 197.11 C109.44 197.47 111.35 197.82 113.26 198.16 C114.16 198.44 115.07 198.71 116 199 C116.33 199.99 116.66 200.98 117 202 C117.6 202.11 118.2 202.22 118.82 202.33 C125.03 203.45 131.24 204.59 137.45 205.74 C139.77 206.16 142.09 206.58 144.42 207 C147.75 207.61 151.07 208.22 154.4 208.84 C155.45 209.02 156.49 209.21 157.57 209.4 C158.05 209.49 158.05 209.49 160.48 209.95 C160.91 210.02 160.91 210.02 163.06 210.42 C163.7 210.61 164.34 210.8 165 211 C165.33 211.66 165.66 212.32 166 213 C105.98 213.67 105.98 213.67 77 210 C76.32 209.92 75.65 209.83 74.95 209.74 C19.48 202.72 -36.25 188.19 -85.94 162.08 C-88.27 160.86 -90.62 159.67 -92.97 158.48 C-119.83 144.81 -145.45 127.8 -167.57 107.25 C-169.59 105.38 -171.65 103.59 -173.75 101.81 C-184.1 92.78 -193.56 82.82 -202 72 C-203.03 70.72 -204.07 69.44 -205.11 68.16 C-206.2 66.82 -207.29 65.47 -208.38 64.12 C-208.89 63.49 -209.4 62.86 -209.93 62.21 C-215.6 55.15 -215.6 55.15 -217 52 C-216.05 47.99 -212.62 45.6 -209.56 43.06 C-209 42.59 -208.43 42.12 -207.85 41.63 C-174.77 14.59 -134.9 -1 -93 -8 C-92.21 -8.13 -91.41 -8.27 -90.6 -8.4 C-60.38 -13.19 -28.78 -10.18 0 0 Z" fill="#23221E" transform="translate(384,558)"/>' +
    '<path d="M0 0 C1.29 2.59 0.83 3.7 0.26 6.52 C0.08 7.43 -0.1 8.34 -0.28 9.29 C-0.48 10.26 -0.67 11.24 -0.88 12.25 C-2.5 20.85 -3.78 29.23 -4 38 C-4.02 38.68 -4.04 39.36 -4.06 40.06 C-4.98 74.65 0.46 108.69 6.92 142.55 C7.05 143.23 7.18 143.91 7.32 144.62 C8.75 152.11 10.2 159.6 11.69 167.08 C22.91 224.17 27.43 282.04 13 339 C14.15 339.33 15.31 339.66 16.5 340 C24.03 342.52 30.99 346.31 38 350 C38.61 350.32 39.21 350.63 39.83 350.96 C54.82 358.86 67.83 369.29 80 381 C80.63 381.58 81.26 382.15 81.91 382.75 C95.58 395.65 105.91 412.72 113 430 C112.34 430 111.68 430 111 430 C109.62 428.6 109.62 428.6 108 426.62 C100.46 417.79 92.15 410.13 83 403 C82.72 402.78 82.72 402.78 81.29 401.65 C57.11 382.61 30.07 368.06 1 358 C0.23 357.73 -0.53 357.46 -1.32 357.18 C-44.11 342.23 -94.28 337.26 -139 346 C-140.01 346.19 -141.02 346.39 -142.06 346.59 C-168 351.71 -192.28 360.42 -216 372 C-216.43 372.21 -216.43 372.21 -218.61 373.25 C-234.46 380.87 -250.52 388.98 -265 399 C-265.66 398.67 -266.32 398.34 -267 398 C-227.07 351.51 -165.12 324.21 -104.6 319.46 C-80.62 317.89 -57.37 319.38 -33.81 323.94 C-33.15 324.06 -32.5 324.19 -31.82 324.32 C-24.54 325.74 -17.38 327.33 -10.28 329.45 C-8 330 -8 330 -4 330 C-0.23 315.76 3.19 301.63 5 287 C5.09 286.28 5.19 285.56 5.29 284.83 C6.25 276.7 6.2 268.55 6.19 260.38 C6.19 259.6 6.19 258.83 6.19 258.03 C6.11 222.24 -0.3 187.39 -6.93 152.34 C-10.92 131.28 -14.43 110.29 -17 89 C-17.06 88.51 -17.06 88.51 -17.37 86.02 C-24.49 27.31 -24.49 27.31 -16 7 C-12.96 3.77 -10.29 2.81 -6 2 C-4.8 1.57 -3.61 1.13 -2.38 0.69 C-1.59 0.46 -0.81 0.23 0 0 Z" fill="#23221E" transform="translate(431,181)"/>' +
    '<path d="M0 0 C11.66 0.77 17.81 4.74 26 13 C27.34 14.66 28.67 16.33 30 18 C32.52 20.5 35.27 22.73 38 25 C38.5 25.43 38.5 25.43 41.04 27.58 C55.18 39.34 70.76 46.01 88 52 C99.17 55.94 99.17 55.94 103 61 C104.13 64.38 104.14 65.58 103 69 C95.45 69.08 87.89 69.13 80.34 69.16 C77.78 69.18 75.22 69.2 72.66 69.23 C56.94 69.38 41.8 68.76 26.26 66.33 C11.07 64.11 -4.67 64.48 -20 64 C-18.49 60.89 -16.75 58.05 -14.83 55.18 C-8.55 45.76 -4.49 37.51 -4 26 C-4.99 26 -5.98 26 -7 26 C-6.81 25.26 -6.61 24.52 -6.41 23.76 C-4.84 17.63 -3.49 11.54 -2.53 5.28 C-2 3 -2 3 0 0 Z" fill="#DA6132" transform="translate(577,156)"/>' +
    '<path d="M0 0 C2.26 1.9 2.26 1.9 3.95 3.77 C5.71 5.68 6.88 6.82 9.26 7.9 C14.36 8.1 19.22 7.62 24.26 6.9 C24.26 7.56 24.26 8.22 24.26 8.9 C25.91 9.23 27.56 9.56 29.26 9.9 C29.26 10.23 29.26 10.56 29.26 10.9 C10.89 14.82 -3.79 15.37 -22.29 11.88 C-49.83 6.8 -72.33 11.58 -97.4 23.1 C-107.89 27.92 -118.4 32.7 -128.99 37.28 C-129.82 37.64 -130.65 38 -131.51 38.38 C-135.24 39.97 -138.7 41.34 -142.74 41.9 C-143.73 40.58 -144.72 39.26 -145.74 37.9 C-144.53 37.61 -143.31 37.32 -142.05 37.03 C-138.18 35.58 -136.92 34.06 -135.18 30.34 C-134.79 29.45 -134.4 28.56 -134 27.64 C-125.22 8.51 -106.73 -5.2 -87.74 -13.1 C-57.45 -23.36 -25.61 -19.31 0 0 Z" fill="#FCF9F4" transform="translate(574.7421875,124.09765625)"/>' +
    '<path d="M0 0 C12.22 9.97 12.22 9.97 14.52 16.87 C5.32 19.41 5.32 19.41 0.52 18.87 C-2.2 16.96 -2.2 16.96 -4.98 14.37 C-24.63 -3.1 -47.96 -8.26 -73.65 -7.3 C-81.8 -6.82 -88.98 -4.82 -96.45 -1.54 C-103.83 1.34 -110.46 1.45 -118.29 1.18 C-118.93 1.17 -118.93 1.17 -122.16 1.11 C-125.27 1.05 -128.38 0.97 -131.48 0.87 C-97.88 -33.89 -35.36 -27.66 0 0 Z" fill="#23221E" transform="translate(583.481689453125,114.1318359375)"/>' +
    '<path d="M0 0 C12.67 -0.22 25.23 0.38 37.87 1.23 C41.02 1.44 44.18 1.64 47.33 1.85 C49.37 1.98 51.4 2.11 53.44 2.25 C54.37 2.31 55.29 2.37 56.25 2.43 C61.86 2.81 67.42 3.34 73 4 C73 4.66 73 5.32 73 6 C18.14 14.67 18.14 14.67 6 7 C3.43 4.99 1.48 2.96 0 0 Z" fill="#DA6132" transform="translate(566,227)"/>' +
    '<path d="M0 0 C1.44 0.09 2.88 0.2 4.31 0.31 C5.11 0.37 5.91 0.43 6.74 0.49 C9.44 1.1 10.43 1.73 12 4 C12.94 17.2 0.84 32.41 -7 42 C-7 38.87 -6.56 37.77 -5.17 35.04 C-4.98 34.65 -4.98 34.65 -4 32.69 C-3.59 31.86 -3.18 31.04 -2.75 30.19 C1.13 22.26 3.99 14.62 6 6 C3.1 8.47 2.11 10.9 0.81 14.44 C-3.47 25.06 -10.16 33.74 -18 42 C-18 38.78 -17.66 38.11 -15.95 35.52 C-15.52 34.86 -15.09 34.19 -14.65 33.51 C-14.19 32.8 -13.72 32.1 -13.25 31.38 C-6.78 21.23 -3.11 11.61 0 0 Z" fill="#FCF9F4" transform="translate(546,141)"/>' +
    '<path d="M0 0 C6.75 -0.12 6.75 -0.12 9 1 C8.56 8.93 5.98 15.62 0.69 21.62 C0.41 21.85 0.41 21.85 -1 23 C-0.82 22.47 -0.64 21.93 -0.45 21.38 C1.49 15.62 3.28 9.83 5 4 C4.67 4.16 4.67 4.16 3 5 C2.43 6.83 2.43 6.83 1.88 9.25 C-0.06 16.18 -3.74 22.23 -8 28 C-8.66 28 -9.32 28 -10 28 C-8.67 24.56 -7.17 21.26 -5.56 17.94 C-2.89 12.12 -1.34 6.24 0 0 Z" fill="#FCF9F4" transform="translate(623,143)"/>' +
    '<path d="M0 0 C7.33 0.28 12.97 2.84 19 7 C21.58 9.94 22.46 12.13 23 16 C17.79 14.42 13.02 12.22 8.12 9.88 C7.34 9.5 6.56 9.13 5.75 8.75 C3.83 7.83 1.92 6.92 0 6 C0 4.02 0 2.04 0 0 Z" fill="#23221E" transform="translate(592,184)"/>' +
    '<path d="M0 0 C5.09 1.42 9.73 4.65 13.2 8.61 C13.88 11.3 13.88 11.3 14.2 13.61 C11.49 12.32 9.05 10.87 6.57 9.18 C2.63 6.65 -1.28 5.42 -5.8 4.29 C-7.8 3.61 -7.8 3.61 -8.8 1.61 C-5.44 -0.63 -3.91 -0.6 0 0 Z" fill="#FCF9F4" transform="translate(666.8046875,208.38671875)"/>' +
    '<path d="M0 0 C5.54 0.69 8.29 1.79 11.91 6.35 C10.88 6.02 9.85 5.69 8.79 5.35 C5.43 4.38 2.42 4.18 -1.09 4.35 C-2.84 8.26 -3.61 11.92 -4.21 16.16 C-4.38 17.32 -4.55 18.48 -4.72 19.68 C-4.84 20.56 -4.96 21.44 -5.09 22.35 C-6.08 22.68 -7.07 23.01 -8.09 23.35 C-7.67 20.26 -7.22 17.18 -6.77 14.1 C-6.66 13.22 -6.54 12.35 -6.42 11.45 C-4.83 0.81 -4.83 0.81 0 0 Z" fill="#FCF9F4" transform="translate(578.0859375,152.65234375)"/>';

  /* flip=true mirrors the goose horizontally so it can fly both ways */
  function gooseSVG(flip) {
    return '<div class="goose-svg"' + (flip ? ' style="transform:scaleX(-1)"' : "") + '>' +
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="156 84 718 695" aria-hidden="true">' + GOOSE_PATHS + "</svg></div>";
  }

  /* ---------- environment ---------- */
  var hasGsap   = typeof window.gsap !== "undefined";
  var reduced   = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePtr   = window.matchMedia && matchMedia("(hover: hover) and (pointer: fine)").matches;
  var noMotion  = /[?&]nomotion=1/.test(location.search);   // debug: static page
  var motionOK  = hasGsap && !reduced && !noMotion;
  var isHome    = document.body.classList.contains("lab-home");
  var isDetail  = document.body.classList.contains("lab-detail");
  var docEl     = document.documentElement;

  if (hasGsap && window.MotionPathPlugin) gsap.registerPlugin(MotionPathPlugin);

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* If GSAP never arrived (CDN blocked), make sure nothing stays hidden
     or locked — the lab must degrade to a normal static page. */
  if (!motionOK) {
    docEl.classList.remove("intro-full", "intro-short", "intro-lock");
    var deadIntro = $("#intro");
    if (deadIntro) deadIntro.style.display = "none";
  }

  /* ---------- data plumbing (same pipeline as the live site) ---------- */
  function onCatalog(fn) {
    if (typeof WAVEBASE_DATA !== "undefined" && Array.isArray(WAVEBASE_DATA) && WAVEBASE_DATA.length) fn();
    window.addEventListener("wavebase:data-ready", fn);
  }
  var FLAGS = {};
  try {
    (WAVEBASE_DESTINATIONS || []).forEach(function (cont) {
      (cont.countries || []).forEach(function (c) { FLAGS[c.name] = c.flag; });
    });
  } catch (e) {}

  var SPORT_MASKS = { wave: "/sport-wave.svg", wind: "/sport-wind.svg", kite: "/sport-kite.svg", wing: "/sport-wing.svg" };
  var SPORT_LABEL = { wave: "Surf", wind: "Windsurf", kite: "Kitesurf", wing: "Wing foil" };
  var NOW_MONTH = new Date().getMonth() + 1;

  /* ---------- shared FX helpers ---------- */
  function spawnRipples(container, x, y, opts) {
    if (!motionOK) return;
    opts = opts || {};
    var n = opts.count || 3;
    for (var i = 0; i < n; i++) {
      var r = document.createElement("div");
      r.className = "ripple" + (opts.ink ? " ink" : "");
      var size = (opts.size || 130) * (1 + i * 0.55);
      r.style.width = r.style.height = size + "px";
      r.style.left = x + "px";
      r.style.top = y + "px";
      container.appendChild(r);
      gsap.fromTo(r, { scale: 0.12, opacity: 0.9 }, {
        scale: 1, opacity: 0,
        duration: (opts.duration || 1.3) + i * 0.22,
        delay: i * 0.14,
        ease: "power2.out",
        onComplete: function (el) { el.remove(); },
        onCompleteParams: [r]
      });
    }
  }

  function spawnFoam(container, x, y, count) {
    if (!motionOK) return;
    for (var i = 0; i < (count || 12); i++) {
      var d = document.createElement("div");
      d.className = "foam-dot";
      d.style.left = x + "px";
      d.style.top = y + "px";
      var s = 4 + Math.random() * 7;
      d.style.width = d.style.height = s + "px";
      container.appendChild(d);
      var ang = Math.random() * Math.PI * 2;
      var dist = 26 + Math.random() * 70;
      gsap.to(d, {
        x: Math.cos(ang) * dist,
        y: Math.sin(ang) * dist * 0.55 - 18,
        opacity: 0,
        duration: 0.7 + Math.random() * 0.6,
        ease: "power2.out",
        onComplete: function (el) { el.remove(); },
        onCompleteParams: [d]
      });
    }
  }

  /* ---------- header goose (every page) ---------- */
  var headerGoose = $("#header-goose");
  if (headerGoose) {
    headerGoose.innerHTML = gooseSVG(false);
    // Hidden until the intro hands the goose over; visible immediately
    // when there is no intro.
    if (isHome && motionOK && (docEl.classList.contains("intro-full") || docEl.classList.contains("intro-short"))) {
      headerGoose.style.opacity = "0";
    }
  }

  /* ============================================================
     INTRO — the goose flies the site in (home only)
     ============================================================ */
  var introDoneCallbacks = [];
  function whenIntroDone(fn) { introDoneCallbacks.push(fn); }
  function fireIntroDone() {
    introDoneCallbacks.forEach(function (fn) { try { fn(); } catch (e) {} });
    introDoneCallbacks = [];
  }

  function markIntroSeen() {
    try { sessionStorage.setItem("sgLabIntroSeen", "1"); } catch (e) {}
  }

  function runIntro() {
    var intro = $("#intro");
    if (!intro || !motionOK || !(docEl.classList.contains("intro-full") || docEl.classList.contains("intro-short"))) {
      docEl.classList.remove("intro-lock");
      if (intro) intro.style.display = "none";
      if (headerGoose) headerGoose.style.opacity = "";
      fireIntroDone();
      return;
    }

    var short = docEl.classList.contains("intro-short");
    var stage = $(".intro-stage");
    var gooseBox = $("#intro-goose");
    var splash = $("#intro-splash");
    var word = $("#intro-word");
    var tag = $("#intro-tag");
    var skip = $("#intro-skip");
    // The goose natively faces right. Full intro enters from the right
    // flying left (mirrored); the short swoop enters from the left.
    gooseBox.innerHTML = gooseSVG(!short);
    var gooseInner = gooseBox.firstChild;

    // innerWidth can briefly report 0 in freshly-spawned/headless
    // windows — fall back so the flight path never collapses to 0.
    var W = window.innerWidth || docEl.clientWidth || 1200;
    var H = window.innerHeight || docEl.clientHeight || 800;
    var finished = false;

    function teardown() {
      if (finished) return;
      finished = true;
      markIntroSeen();
      docEl.classList.remove("intro-lock");
      // Hand the goose to the header logo.
      var hg = headerGoose ? headerGoose.getBoundingClientRect() : null;
      var gr = gooseBox.getBoundingClientRect();
      if (hg && hg.width > 0) {
        var ghost = document.createElement("div");
        ghost.style.cssText = "position:fixed;z-index:9500;pointer-events:none;left:0;top:0;will-change:transform;";
        ghost.style.width = gr.width + "px";
        ghost.style.height = gr.height + "px";
        // Travels up-left to the header, so it keeps facing left;
        // the header goose then settles facing right.
        ghost.innerHTML = gooseSVG(true);
        document.body.appendChild(ghost);
        gsap.set(ghost, { x: gr.left, y: gr.top });
        gooseBox.style.opacity = "0";
        gsap.to(ghost, {
          x: hg.left + hg.width / 2 - gr.width / 2,
          y: hg.top + hg.height / 2 - gr.height / 2,
          scale: hg.width / gr.width,
          duration: 0.75,
          ease: "power3.inOut",
          transformOrigin: "center center",
          onComplete: function () {
            if (headerGoose) {
              headerGoose.style.opacity = "1";
              gsap.fromTo(headerGoose, { scale: 1.25, rotation: -8 }, { scale: 1, rotation: 0, duration: 0.5, ease: "back.out(2.2)" });
            }
            ghost.remove();
          }
        });
      } else if (headerGoose) {
        headerGoose.style.opacity = "1";
      }
      gsap.to(intro, {
        yPercent: -103,
        duration: 0.9,
        ease: "power3.inOut",
        onComplete: function () { intro.remove(); }
      });
      fireIntroDone();
    }

    skip.classList.add("is-ready");
    skip.addEventListener("click", function () {
      gsap.globalTimeline.getChildren(true, true, true).forEach(function (t) {
        if (t.data === "intro") t.kill();
      });
      teardown();
    });
    // Failsafe — never trap the visitor behind the overlay.
    setTimeout(function () { teardown(); }, short ? 4000 : 9000);

    if (short) {
      // Repeat visit: one quick swoop, then into the header.
      var tl = gsap.timeline({ data: "intro", onComplete: teardown });
      tl.set(gooseBox, { x: -0.2 * W, y: 0.34 * H, scale: 0.5, opacity: 1 })
        .to(gooseBox, {
          duration: 1.0,
          ease: "power2.inOut",
          motionPath: window.MotionPathPlugin ? {
            path: [
              { x: 0.25 * W, y: 0.30 * H },
              { x: 0.50 * W - gooseBox.offsetWidth / 2, y: 0.38 * H }
            ],
            curviness: 1.4
          } : { x: 0.5 * W, y: 0.38 * H }
        }, 0)
        .fromTo(word.children, { opacity: 0, y: "0.4em" }, { opacity: 1, y: 0, stagger: 0.025, duration: 0.4, ease: "power2.out" }, 0.25)
        .to({}, { duration: 0.25 });
      return;
    }

    // Full intro.
    var land = { x: 0.5 * W, y: 0.58 * H };
    var gw = gooseBox.offsetWidth, gh = gooseBox.offsetHeight;
    var tl = gsap.timeline({ data: "intro", onComplete: function () {
      gsap.delayedCall(0.55, teardown);
    }});

    // Wing-beat / glide bob on the inner wrapper, killed at touchdown.
    var bob = gsap.to(gooseInner, {
      y: -14, rotation: 2.5,
      duration: 0.55, yoyo: true, repeat: -1, ease: "sine.inOut", data: "intro"
    });

    // Waves drift sideways the whole time.
    $$(".intro-wave").forEach(function (w, i) {
      gsap.to(w, { xPercent: i % 2 ? 3.5 : -3.5, duration: 5 + i, yoyo: true, repeat: -1, ease: "sine.inOut", data: "intro" });
    });

    tl.set(gooseBox, { x: 1.12 * W - gw / 2, y: 0.16 * H - gh / 2, scale: 0.10, rotation: -8, opacity: 0 })
      // far away over the horizon, fading in
      .to(gooseBox, { opacity: 1, duration: 0.35, ease: "power1.out" }, 0.05)
      // the long swooping approach — grows as it nears the viewer
      .to(gooseBox, {
        duration: 2.3,
        ease: "power1.inOut",
        motionPath: window.MotionPathPlugin ? {
          path: [
            { x: 0.84 * W - gw / 2, y: 0.10 * H - gh / 2 },
            { x: 0.62 * W - gw / 2, y: 0.22 * H - gh / 2 },
            { x: 0.52 * W - gw / 2, y: 0.40 * H - gh / 2 },
            { x: 0.455 * W - gw / 2, y: 0.52 * H - gh / 2 },
            { x: land.x - gw / 2, y: land.y - gh / 2 }
          ],
          curviness: 1.35
        } : { x: land.x - gw / 2, y: land.y - gh / 2 }
      }, 0.05)
      .to(gooseBox, { scale: 0.50, duration: 0.9, ease: "power1.in" }, 0.05)      // approach
      .to(gooseBox, { scale: 1.05, duration: 0.8, ease: "power1.inOut" }, 0.95)   // closest to the viewer
      .to(gooseBox, { scale: 0.62, duration: 0.6, ease: "power2.out" }, 1.78)     // flares down to the water
      .to(gooseBox, { rotation: 9, duration: 0.7, ease: "sine.inOut" }, 0.6)      // banking
      .to(gooseBox, { rotation: -6, duration: 0.7, ease: "sine.inOut" }, 1.3)
      .to(gooseBox, { rotation: 0, duration: 0.4, ease: "sine.out" }, 2.0)
      // touchdown
      .add(function () {
        bob.kill();
        gsap.to(gooseInner, { y: 0, rotation: 0, duration: 0.3, ease: "power2.out" });
        gsap.fromTo(gooseBox, { scaleY: 1 }, { scaleY: 0.9, duration: 0.12, yoyo: true, repeat: 1, ease: "power1.inOut" });
        spawnRipples(splash, land.x, land.y + gh * 0.34, { size: 150 });
        spawnFoam(splash, land.x, land.y + gh * 0.3, 14);
        // gentle bobbing on the water while the word appears
        gsap.to(gooseBox, { y: "+=7", duration: 1.1, yoyo: true, repeat: -1, ease: "sine.inOut", data: "intro" });
      }, 2.38)
      // the brand surfaces
      .fromTo(word.children,
        { opacity: 0, y: "0.9em" },
        { opacity: 1, y: 0, stagger: 0.055, duration: 0.7, ease: "back.out(1.6)" }, 1.9)
      .to(tag, { opacity: 1, duration: 0.6, ease: "power2.out" }, 2.7)
      .to({}, { duration: 0.5 });   // beat before teardown
  }

  /* ============================================================
     WATER SCROLL — Lenis glide + swell tilt + buddy + parallax
     ============================================================ */
  var smooth = null;
  if (motionOK && window.Lenis && finePtr) {
    smooth = new Lenis({ duration: 1.35, smoothWheel: true });
    window.__labLenis = smooth;   // debug handle
  }

  var lastY = window.scrollY, vel = 0;
  var swellInner = $("#swell-inner");
  var buddy = $("#buddy"), buddyGoose = $("#buddy-goose"), buddyPath = $("#buddy-path");
  var buddyLen = 0;
  if (buddyGoose) buddyGoose.innerHTML = gooseSVG(false);
  if (buddyPath && buddyPath.getTotalLength) buddyLen = buddyPath.getTotalLength();

  var bandEl = $("#paddle-band");
  var driftEls = $$("[data-drift]");

  function motionFrame(time) {
    if (window.__labFreeze) { requestAnimationFrame(motionFrame); return; }   // debug hatch
    if (smooth) smooth.raf(time);
    var y = window.scrollY;
    var rawV = y - lastY;
    lastY = y;
    vel += (rawV - vel) * 0.12;                       // smoothed velocity

    // Swell: the page tips ever so slightly with your paddle strokes.
    if (swellInner) {
      var tilt = Math.max(-1.15, Math.min(1.15, vel * -0.045));
      swellInner.style.transform = "rotateX(" + tilt.toFixed(3) + "deg)";
    }

    // Buddy goose paddles along its dotted swell line.
    if (buddy && buddyLen && buddy.classList.contains("is-on")) {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var p = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;
      var pt = buddyPath.getPointAtLength(p * buddyLen);
      var bank = Math.max(-26, Math.min(26, vel * 0.7));
      buddyGoose.style.transform = "translate(" + pt.x + "px," + pt.y + "px) rotate(" + bank + "deg)";
    }

    // Parallax drift layers in the paddle band.
    if (bandEl && driftEls.length) {
      var r = bandEl.getBoundingClientRect();
      if (r.bottom > 0 && r.top < window.innerHeight) {
        var rel = (r.top + r.height / 2 - window.innerHeight / 2);
        driftEls.forEach(function (el) {
          var f = parseFloat(el.getAttribute("data-drift")) || 0;
          el.style.transform = "translateY(" + (rel * f).toFixed(1) + "px)";
        });
      }
    }

    requestAnimationFrame(motionFrame);
  }
  if (motionOK) requestAnimationFrame(motionFrame);

  /* ---------- reveals ---------- */
  var revealIO = null;
  function setupReveals() {
    if (!motionOK || !("IntersectionObserver" in window)) return;
    docEl.classList.add("reveal-init");
    revealIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        revealIO.unobserve(en.target);
        var el = en.target;
        var idx = parseInt(el.getAttribute("data-ri") || "0", 10);
        gsap.fromTo(el,
          { y: 56, rotateX: 9, autoAlpha: 0, transformPerspective: 900, transformOrigin: "50% 100%" },
          { y: 0, rotateX: 0, autoAlpha: 1, duration: 0.95, delay: (idx % 3) * 0.09, ease: "power3.out", clearProps: "transform,perspective" });
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    observeReveals();
  }
  function observeReveals(root) {
    if (!revealIO) return;
    $$(".reveal, .lab-card-wrap, .step-card", root).forEach(function (el, i) {
      if (el.dataset.riSeen) return;
      el.dataset.riSeen = "1";
      el.setAttribute("data-ri", String(i));
      revealIO.observe(el);
    });
  }

  /* ============================================================
     VEIL — wave transition between lab pages
     ============================================================ */
  var veil = $("#veil"), veilGoose = $("#veil-goose");
  if (veilGoose) veilGoose.innerHTML = gooseSVG(false);   // sweeps left → right, faces right

  function leaveVia(url) {
    if (!motionOK || !veil) { location.href = url; return; }
    try { sessionStorage.setItem("sgLabTransit", "1"); } catch (e) {}
    var W = window.innerWidth || docEl.clientWidth || 1200;
    gsap.timeline()
      .set(veil, { yPercent: 100, y: 94 })
      .to(veil, { yPercent: 0, y: 0, duration: 0.55, ease: "power3.in" })
      .fromTo(veilGoose,
        { x: -0.18 * W, y: 0, opacity: 1, rotation: 6 },
        { x: 1.1 * W, y: -60, rotation: -8, duration: 0.65, ease: "power1.inOut" }, 0.18)
      .add(function () { location.href = url; }, 0.78);
  }
  function liftVeil() {
    if (!veil) return;
    try { sessionStorage.removeItem("sgLabTransit"); } catch (e) {}
    if (!docEl.classList.contains("arrived-via-veil")) return;
    if (!motionOK) { docEl.classList.remove("arrived-via-veil"); veil.style.transform = ""; return; }
    gsap.to(veil, {
      yPercent: 100, y: 94, duration: 0.7, ease: "power3.out", delay: 0.15,
      onComplete: function () { docEl.classList.remove("arrived-via-veil"); gsap.set(veil, { clearProps: "transform" }); }
    });
  }
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a[data-transition]");
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    leaveVia(a.getAttribute("href"));
  });

  /* ============================================================
     CARDS (home)
     ============================================================ */
  function inSeason(e) { return (e.goodMonths || []).indexOf(NOW_MONTH) !== -1; }

  function pickEntries(type) {
    var all = WAVEBASE_DATA.filter(function (e) { return e && e.name && (e.coords || []).length === 2; });
    var pool = type === "all" ? all : all.filter(function (e) { return e.type === type; });
    // In-season first, then the rest; stable mix of types for "all".
    function rank(list) {
      return list.slice().sort(function (a, b) { return (inSeason(b) ? 1 : 0) - (inSeason(a) ? 1 : 0); });
    }
    if (type !== "all") return rank(pool).slice(0, 9);
    var spots = rank(pool.filter(function (e) { return e.type === "spot"; }));
    var centers = rank(pool.filter(function (e) { return e.type === "center"; }));
    var stays = rank(pool.filter(function (e) { return e.type === "stay"; }));
    var mix = [];
    for (var i = 0; i < 3; i++) {
      if (spots[i]) mix.push(spots[i]);
      if (centers[i]) mix.push(centers[i]);
      if (stays[i]) mix.push(stays[i]);
    }
    return mix.slice(0, 9);
  }

  function monthsStrip(e) {
    var cells = "";
    for (var m = 1; m <= 12; m++) {
      var cls = (e.goodMonths || []).indexOf(m) !== -1 ? "on" : "";
      if (m === NOW_MONTH) cls += " now";
      cells += '<b class="' + cls + '" title="' + (WAVEBASE_MONTHS[m] || m) + '"></b>';
    }
    return '<div class="card-months" aria-label="Months in season">' + cells + "</div>";
  }

  function priceLine(e) {
    var p = e.prices;
    if (e.type === "stay" && p && p.fromEUR != null) {
      return '<span class="card-price">&euro;' + esc(p.fromEUR) + (p.toEUR ? "&ndash;" + esc(p.toEUR) : "") + " <small>/ night</small></span>";
    }
    if (e.type === "center" && p) {
      if (p.groupLessonEUR != null) return '<span class="card-price">lessons from &euro;' + esc(p.groupLessonEUR) + "</span>";
      if (p.rentalDayEUR != null) return '<span class="card-price">rental from &euro;' + esc(p.rentalDayEUR) + " <small>/ day</small></span>";
    }
    var sports = (e.sports || []).map(function (s) { return SPORT_LABEL[s] || s; }).join(" · ");
    return '<span class="card-price"><small>' + esc(sports || "—") + "</small></span>";
  }

  function cardHTML(e, i) {
    var flag = FLAGS[e.country] || "";
    var sport = (e.sports || [])[0];
    var mask = SPORT_MASKS[sport];
    var levels = (e.levels || []).map(function (l) {
      return '<span class="level-chip ' + esc(l) + '">' + esc(l.charAt(0).toUpperCase() + l.slice(1)) + "</span>";
    }).join("");
    return (
      '<div class="lab-card-wrap" data-ri="' + i + '">' +
        '<a class="lab-card" href="spot.html?id=' + encodeURIComponent(e.id) + '" data-transition data-tilt>' +
          '<div class="card-art card-art-' + esc(e.type) + '">' +
            '<svg class="card-art-waves" viewBox="0 0 400 46" preserveAspectRatio="none" aria-hidden="true"><path d="M0,28 C60,10 120,40 200,24 C280,8 340,38 400,20 L400,46 L0,46 Z"/></svg>' +
            '<div class="card-goose-stamp">' + gooseSVG(false) + "</div>" +
            (mask ? '<span class="card-sport" style="-webkit-mask-image:url(' + mask + ');mask-image:url(' + mask + ')"></span>' : "") +
            '<span class="type-chip">' + esc(e.type) + "</span>" +
            (inSeason(e) ? '<span class="season-chip"><span class="dot"></span>In season now</span>' : "") +
          "</div>" +
          '<div class="card-body">' +
            '<span class="card-place">' + esc(e.town || "") + (e.country ? " · " + esc(e.country) + " " + flag : "") + "</span>" +
            '<h3 class="card-name">' + esc(e.name) + "</h3>" +
            '<p class="card-tagline">' + esc(e.tagline || "") + "</p>" +
            '<div class="card-chips">' + levels + "</div>" +
            monthsStrip(e) +
            '<div class="card-foot">' + priceLine(e) + '<span class="card-cta">Honest story &rarr;</span></div>' +
          "</div>" +
        "</a>" +
      "</div>"
    );
  }

  function wireTilt(root) {
    if (!motionOK || !finePtr) return;
    $$("[data-tilt]", root).forEach(function (card) {
      var rx = gsap.quickTo(card, "rotationX", { duration: 0.5, ease: "power2.out" });
      var ry = gsap.quickTo(card, "rotationY", { duration: 0.5, ease: "power2.out" });
      var tz = gsap.quickTo(card, "z", { duration: 0.5, ease: "power2.out" });
      gsap.set(card, { transformPerspective: 900 });
      card.addEventListener("pointermove", function (ev) {
        var r = card.getBoundingClientRect();
        var px = (ev.clientX - r.left) / r.width - 0.5;
        var py = (ev.clientY - r.top) / r.height - 0.5;
        rx(py * -8); ry(px * 9); tz(14);
      });
      card.addEventListener("pointerleave", function () { rx(0); ry(0); tz(0); });
    });
  }

  var currentType = "all";
  function renderCards() {
    var grid = $("#lab-cards");
    if (!grid) return;
    var entries = pickEntries(currentType);
    if (!entries.length) {
      grid.innerHTML = '<p class="cards-empty">The catalog is waking up (free-tier API can take ~30&nbsp;s on a cold start) — or it could not be reached. The design still works; the data will follow.</p>';
      return;
    }
    grid.innerHTML = entries.map(cardHTML).join("");
    var sub = $("#cards-sub");
    if (sub) {
      var n = WAVEBASE_DATA.filter(function (e) { return inSeason(e); }).length;
      sub.textContent = "Real entries from the live catalog — " + n + " are in season this " + (WAVEBASE_MONTHS[NOW_MONTH] || "month") + ".";
    }
    wireTilt(grid);
    if (revealIO) {
      $$(".lab-card-wrap", grid).forEach(function (el, i) {
        el.dataset.riSeen = "1";
        el.setAttribute("data-ri", String(i));
        revealIO.observe(el);
      });
    }
  }

  function wirePills() {
    var pills = $$("#type-pills .type-pill");
    pills.forEach(function (p) {
      p.addEventListener("click", function () {
        currentType = p.getAttribute("data-type");
        pills.forEach(function (q) {
          q.classList.toggle("is-on", q === p);
          q.setAttribute("aria-selected", q === p ? "true" : "false");
        });
        renderCards();
      });
    });
  }

  function skeletons() {
    var grid = $("#lab-cards");
    if (!grid) return;
    var s = "";
    for (var i = 0; i < 6; i++) s += '<div class="skeleton-card"></div>';
    grid.innerHTML = s;
  }

  /* ---------- paddle band ambience ---------- */
  function setupBand() {
    var foam = $("#band-foam");
    var bandGoose = $("#band-goose");
    if (bandGoose) {
      bandGoose.innerHTML = gooseSVG(false);
      if (motionOK) {
        gsap.to(bandGoose, { y: -9, rotation: 3, duration: 1.6, yoyo: true, repeat: -1, ease: "sine.inOut" });
      }
    }
    if (foam && motionOK) {
      for (var i = 0; i < 16; i++) {
        var b = document.createElement("i");
        var s = 3 + Math.random() * 8;
        b.style.width = b.style.height = s + "px";
        b.style.left = (4 + Math.random() * 92) + "%";
        b.style.top = (8 + Math.random() * 84) + "%";
        b.style.opacity = String(0.25 + Math.random() * 0.4);
        foam.appendChild(b);
        gsap.to(b, {
          y: -(14 + Math.random() * 26),
          x: (Math.random() - 0.5) * 22,
          duration: 2.6 + Math.random() * 3,
          yoyo: true, repeat: -1, ease: "sine.inOut",
          delay: Math.random() * 2
        });
      }
    }
  }

  /* ============================================================
     DETAIL PAGE — the goose lands on the exact location
     ============================================================ */
  var detail = { map: null, entry: null, marker: null, landed: false };

  function resolveEntry() {
    var id = null;
    try { id = new URLSearchParams(location.search).get("id"); } catch (e) {}
    var found = null;
    if (id) found = WAVEBASE_DATA.find(function (e) { return e.id === id; });
    if (!found) found = WAVEBASE_DATA.find(function (e) { return e.id === "devils-rock"; });
    if (!found) found = WAVEBASE_DATA.find(function (e) { return e.type === "spot" && (e.coords || []).length === 2; });
    if (!found) found = WAVEBASE_DATA.find(function (e) { return (e.coords || []).length === 2; });
    return found || null;
  }

  function typeChipHTML(t) { return '<span class="type-chip">' + esc(t) + "</span>"; }

  function renderDetailHero(e) {
    var meta = $("#detail-meta");
    var flag = FLAGS[e.country] || "";
    meta.innerHTML = typeChipHTML(e.type) +
      '<span class="place">' + esc(e.town || "") + (e.country ? " · " + esc(e.country) + " " + flag : "") + "</span>" +
      ((e.sports || []).length ? '<span class="place">' + esc(e.sports.map(function (s) { return SPORT_LABEL[s] || s; }).join(" · ")) + "</span>" : "");
    var name = $("#detail-name");
    name.classList.remove("skeleton-text");
    name.textContent = e.name;
    $("#detail-tagline").textContent = e.tagline || "";
    document.title = "SurfGoose · Design Lab — " + e.name;

    var coordsP = $("#map-coords");
    var parts = [];
    if (e.coordsLabel) parts.push(esc(e.coordsLabel));
    else if ((e.coords || []).length === 2) parts.push(e.coords[0].toFixed(4) + ", " + e.coords[1].toFixed(4));
    if (e.googleMapsQuery) {
      parts.push('<a href="https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(e.googleMapsQuery) + '" target="_blank" rel="noopener">Open in Google Maps &nearr;</a>');
    }
    coordsP.innerHTML = parts.join(" &nbsp;·&nbsp; ");
  }

  function layerBlockHTML(l) {
    var inner = (l.inhoud || []).map(function (c) {
      return (c.kop ? "<h4>" + esc(c.kop) + "</h4>" : "") + "<p>" + esc(c.tekst) + "</p>";
    }).join("");
    return '<div class="layer-block"><h3>' + esc(l.titel) + "</h3>" +
      (l.bron ? '<p class="layer-bron">Source: ' + esc(l.bron) + "</p>" : "") + inner + "</div>";
  }

  function renderDetailBody(e) {
    var host = $("#detail-body");
    var html = "";

    if ((e.samenvatting || []).length) {
      html += '<div class="detail-card reveal"><h2><span class="h-goose">' + gooseSVG(false) + "</span>The honest summary</h2><ul>" +
        e.samenvatting.map(function (s) { return "<li>" + esc(s) + "</li>"; }).join("") + "</ul></div>";
    }

    if (e.ideaalVoor || e.nietIdeaalAls) {
      html += '<div class="fit-grid">' +
        (e.ideaalVoor ? '<div class="detail-card good reveal"><h2><span class="h-goose">' + gooseSVG(false) + "</span>Go if</h2><p>" + esc(e.ideaalVoor) + "</p></div>" : "") +
        (e.nietIdeaalAls ? '<div class="detail-card bad reveal"><h2><span class="h-goose">' + gooseSVG(false) + "</span>Skip if</h2><p>" + esc(e.nietIdeaalAls) + "</p></div>" : "") +
        "</div>";
    }

    var p = e.prices;
    if (p && (p.fromEUR != null || p.groupLessonEUR != null || p.rentalDayEUR != null)) {
      var big = "", unit = "";
      if (p.fromEUR != null) { big = "&euro;" + esc(p.fromEUR) + (p.toEUR ? " &ndash; &euro;" + esc(p.toEUR) : ""); unit = esc(p.unit || "per night"); }
      else if (p.groupLessonEUR != null) { big = "&euro;" + esc(p.groupLessonEUR); unit = "group lesson" + (p.groupLessonNote ? " · " + esc(p.groupLessonNote) : ""); }
      else { big = "&euro;" + esc(p.rentalDayEUR); unit = "rental / day" + (p.rentalNote ? " · " + esc(p.rentalNote) : ""); }
      html += '<div class="detail-card reveal"><h2><span class="h-goose">' + gooseSVG(false) + "</span>What it costs</h2>" +
        '<div class="price-line"><span class="big">' + big + '</span><span class="unit">' + unit + "</span></div>" +
        (p.source ? '<p class="detail-source">' + esc(p.source) + "</p>" : "") + "</div>";
    }

    if ((e.lagen || []).length) {
      html += '<div class="detail-card reveal"><h2><span class="h-goose">' + gooseSVG(false) + "</span>Layer by layer</h2>" +
        e.lagen.slice(0, 2).map(layerBlockHTML).join("") + "</div>";
    }

    if ((e.verhaal || []).length) {
      html += '<div class="detail-card reveal"><h2><span class="h-goose">' + gooseSVG(false) + "</span>The story</h2>" +
        e.verhaal.map(function (par) { return "<p>" + esc(par) + "</p>"; }).join("") + "</div>";
    }

    host.innerHTML = html;
    observeReveals(host);
  }

  function gooseLanding() {
    var e = detail.entry, map = detail.map;
    if (!e || !map || detail.landed) return;
    detail.landed = true;

    var flightHost = $("#map-flight");
    var replayBtn = $("#map-replay");
    var ll = L.latLng(e.coords[0], e.coords[1]);

    function dropPin() {
      if (detail.marker) { map.removeLayer(detail.marker); detail.marker = null; }
      var icon = L.divIcon({
        className: "goose-pin pin-pop",
        html: '<div class="pin-disc"><div>' + gooseSVG(false) + "</div></div>",
        iconSize: [52, 52],
        iconAnchor: [26, 49]
      });
      detail.marker = L.marker(ll, { icon: icon }).addTo(map);
      detail.marker.bindPopup("<b>" + esc(e.name) + "</b><br>" + esc(e.town || "") + (e.country ? " · " + esc(e.country) : ""), { offset: [0, -42] });
      setTimeout(function () { if (detail.marker) detail.marker.openPopup(); }, 450);
      if (replayBtn) replayBtn.classList.add("is-on");
    }

    if (!motionOK) { dropPin(); return; }

    // Freeze the map while the goose is on approach so the target
    // pixel stays put.
    map.dragging.disable(); map.scrollWheelZoom.disable();
    map.doubleClickZoom.disable(); map.touchZoom.disable();
    function unfreeze() {
      map.dragging.enable(); map.scrollWheelZoom.enable();
      map.doubleClickZoom.enable(); map.touchZoom.enable();
    }

    var pt = map.latLngToContainerPoint(ll);
    var W = flightHost.clientWidth || 600;

    var g = document.createElement("div");
    g.className = "flight-goose";
    g.innerHTML = gooseSVG(false);   // approaches from the left flying right — its native facing
    flightHost.appendChild(g);
    var inner = g.firstChild;

    var flap = gsap.to(inner, { y: -9, rotation: 3, duration: 0.4, yoyo: true, repeat: -1, ease: "sine.inOut" });

    gsap.timeline({
      onComplete: function () {
        flap.kill();
        gsap.to(g, { opacity: 0, duration: 0.45, delay: 0.15, onComplete: function () { g.remove(); } });
        spawnRipples(flightHost, pt.x, pt.y, { count: 3, size: 120, ink: true });
        spawnFoam(flightHost, pt.x, pt.y, 12);
        dropPin();
        unfreeze();
      }
    })
      .set(g, { x: -0.22 * W, y: Math.max(30, pt.y - 220), scale: 1.5, rotation: 9, opacity: 1 })
      .to(g, {
        duration: 1.7,
        ease: "power1.inOut",
        motionPath: window.MotionPathPlugin ? {
          path: [
            { x: 0.22 * W, y: Math.max(16, pt.y - 250) },
            { x: 0.62 * W, y: Math.max(40, pt.y - 140) },
            { x: pt.x + 60, y: pt.y - 60 },
            { x: pt.x, y: pt.y - 14 }
          ],
          curviness: 1.3
        } : { x: pt.x, y: pt.y - 14 }
      }, 0)
      .to(g, { scale: 0.4, duration: 1.7, ease: "power2.in" }, 0)
      .to(g, { rotation: -7, duration: 0.6, ease: "sine.inOut" }, 0.4)
      .to(g, { rotation: 3, duration: 0.6, ease: "sine.inOut" }, 1.0)
      .to(g, { rotation: 0, duration: 0.3 }, 1.5)
      .to(g, { scaleY: 0.85, duration: 0.1, yoyo: true, repeat: 1 }, 1.68);
  }

  function initDetailMap() {
    var el = $("#lab-map");
    var e = detail.entry;
    if (!el || !e || typeof L === "undefined" || detail.map) return;

    var ll = [e.coords[0], e.coords[1]];
    var map = L.map(el, { zoomControl: true, attributionControl: true });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    detail.map = map;

    if (!motionOK) {
      map.setView(ll, 12);
      gooseLanding();
      return;
    }

    // Cinematic approach: start wide over the region, glide in, then
    // the goose takes over for the final descent.
    map.setView(ll, 5);
    setTimeout(function () {
      map.once("moveend", function () { setTimeout(gooseLanding, 150); });
      map.flyTo(ll, 12, { duration: 1.6 });
    }, docEl.classList.contains("arrived-via-veil") ? 600 : 250);

    var replayBtn = $("#map-replay");
    if (replayBtn) {
      replayBtn.addEventListener("click", function () {
        if (!detail.landed) return;
        detail.landed = false;
        replayBtn.classList.remove("is-on");
        if (detail.marker) { map.removeLayer(detail.marker); detail.marker = null; }
        map.once("moveend", function () { setTimeout(gooseLanding, 120); });
        var current = map.getCenter();
        var far = map.getZoom() <= 7;
        map.flyTo(ll, 12, { duration: far || map.distance(current, L.latLng(ll)) > 50000 ? 1.4 : 0.8 });
      });
    }
  }

  /* ============================================================
     BOOT
     ============================================================ */
  function bootHome() {
    skeletons();
    wirePills();
    setupBand();
    setupReveals();
    onCatalog(renderCards);

    whenIntroDone(function () {
      if (buddy && motionOK && finePtr) buddy.classList.add("is-on");
    });
    runIntro();
  }

  function bootDetail() {
    setupReveals();
    var rendered = false;
    onCatalog(function () {
      var e = resolveEntry();
      if (!e) return;
      var firstTime = !rendered || (detail.entry && detail.entry.id !== e.id);
      detail.entry = e;
      if (!rendered) {
        renderDetailHero(e);
        renderDetailBody(e);
        rendered = true;
        initDetailMap();
      } else if (firstTime) {
        renderDetailHero(e);
        renderDetailBody(e);
      }
    });
    liftVeil();
  }

  if (isHome) bootHome();
  if (isDetail) bootDetail();
})();
