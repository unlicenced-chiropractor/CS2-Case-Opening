export const CASE_COST = 10;
export const STIPEND_INTERVAL_MS = 15 * 60 * 1000;
export const STIPEND_THRESHOLD = 5;
export const STIPEND_AMOUNT = 100;
export const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;
export const RESET_LINK_TTL_MS = 24 * 60 * 60 * 1000;
export const CATALOG_CACHE_TTL_MS = 10 * 60 * 1000;

export const BYMYKEL_SKINS_URL =
  "https://raw.githubusercontent.com/ByMykel/CSGO-API/main/public/api/en/skins_not_grouped.json";

export const YOUPIN_PRICES_URL =
  "https://prices.csgotrader.app/latest/youpin.json";

export const WEAR_TABLE = [
  { name: "Factory New", short: "FN", weight: 15 },
  { name: "Minimal Wear", short: "MW", weight: 24 },
  { name: "Field-Tested", short: "FT", weight: 35 },
  { name: "Well-Worn", short: "WW", weight: 16 },
  { name: "Battle-Scarred", short: "BS", weight: 10 },
] as const;

export const WEAR_MULTIPLIER = {
  "Factory New": 1.2,
  "Minimal Wear": 1.1,
  "Field-Tested": 1,
  "Well-Worn": 0.85,
  "Battle-Scarred": 0.72,
} as const;

export const RARITY_WEIGHTS = [
  { rarity: "Mil-Spec", weight: 55 },
  { rarity: "Restricted", weight: 28 },
  { rarity: "Classified", weight: 12 },
  { rarity: "Covert", weight: 4.5 },
  { rarity: "Rare Special", weight: 0.5 },
] as const;

export const RARITY_TIER: Record<string, number> = {
  "Mil-Spec": 0,
  Restricted: 1,
  Classified: 2,
  Covert: 3,
  "Rare Special": 4,
};

export const CASE_SKINS: Record<
  string,
  { name: string; rarity: string; value: number; icon: string }[]
> = {
  free: [
    {
      name: "FAMAS | Mecha Industries",
      rarity: "Mil-Spec",
      value: 2.4,
      icon: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL3n5vh7h1c_M2oaalsM8-eC2SYwNF6ueZhW2ewwx4hsm3dz46heSjCPVUjC8chEOYMtxOwkNHiYb63swXY3Y9Nn32skGoXuc3DGOrc",
    },
    {
      name: "SG 553 | Pulse",
      rarity: "Mil-Spec",
      value: 1.9,
      icon: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLimcO1qx1Y-s29b_E4c8-DG2uDxNF6ueZhW2eykUh24jjczYqscH7GblIpCJBxF-AD4BHtxIKzM-nq5ACK3t1GyySskGoXuRyAaawM",
    },
    {
      name: "P90 | Elite Build",
      rarity: "Mil-Spec",
      value: 1.65,
      icon: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLhx8bf_jdk_6v-V6lsM-SWHH6vzedxuPUnHyi1xE9xsGiDmdqpdnmRPwcgDZslRuAM40Trx93nNevj7gOPjdlGzzK-0H27CoeJJQ",
    },
    {
      name: "Galil AR | Signal",
      rarity: "Mil-Spec",
      value: 1.25,
      icon: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL2n5rp8SNJ0Pq3V6NsLPmfMXSZxuB3vN57Si2MmRQguynLnIqvIy-TO1UlXJMjEeAN4UGwk9DkZLnltgPYjYkTnCn6iy8buips5PFCD_QZl2QaUg",
    },
    {
      name: "XM1014 | Entombed",
      rarity: "Mil-Spec",
      value: 1.75,
      icon: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLpk8ewrHZk7OeRcKk8cKHHMWad1OJzpN5rQzy2qhEutDWR1N-hI3yWbVRyD8YiEOVZ50TqmoKyZb7rtVfWgosQzX7-3X9K5yc4tr4cEf1yVvkijss",
    },
    {
      name: "Nova | Antique",
      rarity: "Mil-Spec",
      value: 1.5,
      icon: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL_kYDhwiFO0PyhfqVSIf6HB3aFxNF6ueZhW2fmwRwl6jyHw96vIn2UbVVzXMdyRuYLt0O7ltPjZbu0tQTejo9Hyn2skGoXucYtjcOH",
    },
    {
      name: "MP7 | Armor Core",
      rarity: "Mil-Spec",
      value: 1.3,
      icon: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8jsHf_DNk4uL5V7FhNOKSA2iUxPx4j-1gSCGn2xhw6zjSzYysICiUOgV0Cpd1TORe5BW9w922Nrux5gKLitpGz3irhnlXrnE866qixJk",
    },
    {
      name: "USP-S | Cortex",
      rarity: "Restricted",
      value: 5.62,
      icon: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLkjYbf7itX6vytbbZSI-WsG3SA_u1jpN5lRi67gVNz4G7Qm938cS_Da1AhXpB1EeVb4xm4mtDjN7vj4A3b2NpGyCr52i4Y8G81tMzdoYZ7",
    },
    {
      name: "Glock-18 | Vogue",
      rarity: "Restricted",
      value: 5.2,
      icon: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL2kpnj9h1Y-s2pZKtuK8-WF2KTzuBiseJ9cCW6khUz_T-GyNavdCqRawN1CMFwTOcO5hO7loXiY-zmsQKPi44QzHj22ikcvy11o7FVfFOBmfY",
    },
    {
      name: "MAC-10 | Neon Rider",
      rarity: "Restricted",
      value: 6.6,
      icon: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8n5WxrR1Y-s2jaac8cM-dC2ie0-dytfNWQyC0nQlp5DzTntmgdC7COABxX5NxQrUOtUS5w4LgMu6zsVCK2IJCmyisjitM6DErvbicsEA0SQ",
    },
    {
      name: "Desert Eagle | Mecha Industries",
      rarity: "Restricted",
      value: 7.15,
      icon: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL1m5fn8Sdk6OGRbKFsJ_yWMWqVwuZ3j-1gSCGn20h042vSyY2tdyjCZwIlXJBxQeNe4EWxxoHkMOq0sQGIid5Fnyr42HtXrnE8p4gbgvE",
    },
    {
      name: "AK-47 | Redline",
      rarity: "Classified",
      value: 14.8,
      icon: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwlcK3wiFO0POlPPNSI_-RHGavzedxuPUnFniykEtzsWWBzoyuIiifaAchDZUjTOZe4RC_w4buM-6z7wzbgokUyzK-0H08hRGDMA",
    },
    {
      name: "P250 | See Ya Later",
      rarity: "Classified",
      value: 11.3,
      icon: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLhzMOwwiFO0OL8PfRSI-mRC3WT0-F1j-1gSCGn2x9ytmzWnN6pInjGOwMlDZp0EORe5BHsx93lP7zr5wzbiI5AyXr_jS9XrnE8gQrIgng",
    },
    {
      name: "AWP | Neo-Noir",
      rarity: "Covert",
      value: 39.25,
      icon: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwiYbf_jdk7uW-V6poL_6cB3WvzedxuPUnHirrxR4l423SyI39I3KXPwdxWZclQeNZ5EXskYfnNeyw71OMi9lNzDK-0H3r66pOTw",
    },
    {
      name: "MP9 | Starlight Protector",
      rarity: "Covert",
      value: 31.9,
      icon: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8js_f-jFk4uL3V7d5IeKfB2CY1dF6ueZhW2flkUtztz_SzYypJSqRalUhDJNwQO4PsBXtx9HkN-K37w3bgohGmHn3kGoXuZ3lRdvF",
    },
    {
      name: "★ Karambit | Doppler",
      rarity: "Rare Special",
      value: 980,
      icon: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1Q7uCvZaZkNM-SA1iSze91u_FsTju_qhAmoT-Jn4bjJC_4Ml93UtZuRLQPsBawkNfiMbnl5AKMiopCnin7iCJBv31j4rkBBKEg-6zUjV3GY6p9v8dpLWT3Fg",
    },
  ],
  classic: [
    {
      name: "FAMAS | Mecha Industries",
      rarity: "Mil-Spec",
      value: 2.4,
      icon: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL3n5vh7h1c_M2oaalsM8-eC2SYwNF6ueZhW2ewwx4hsm3dz46heSjCPVUjC8chEOYMtxOwkNHiYb63swXY3Y9Nn32skGoXuc3DGOrc",
    },
    {
      name: "SG 553 | Pulse",
      rarity: "Mil-Spec",
      value: 1.9,
      icon: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLimcO1qx1Y-s29b_E4c8-DG2uDxNF6ueZhW2eykUh24jjczYqscH7GblIpCJBxF-AD4BHtxIKzM-nq5ACK3t1GyySskGoXuRyAaawM",
    },
    {
      name: "P90 | Elite Build",
      rarity: "Mil-Spec",
      value: 1.65,
      icon: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLhx8bf_jdk_6v-V6lsM-SWHH6vzedxuPUnHyi1xE9xsGiDmdqpdnmRPwcgDZslRuAM40Trx93nNevj7gOPjdlGzzK-0H27CoeJJQ",
    },
    {
      name: "Galil AR | Signal",
      rarity: "Mil-Spec",
      value: 1.25,
      icon: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL2n5rp8SNJ0Pq3V6NsLPmfMXSZxuB3vN57Si2MmRQguynLnIqvIy-TO1UlXJMjEeAN4UGwk9DkZLnltgPYjYkTnCn6iy8buips5PFCD_QZl2QaUg",
    },
    {
      name: "XM1014 | Entombed",
      rarity: "Mil-Spec",
      value: 1.75,
      icon: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLpk8ewrHZk7OeRcKk8cKHHMWad1OJzpN5rQzy2qhEutDWR1N-hI3yWbVRyD8YiEOVZ50TqmoKyZb7rtVfWgosQzX7-3X9K5yc4tr4cEf1yVvkijss",
    },
    {
      name: "Nova | Antique",
      rarity: "Mil-Spec",
      value: 1.5,
      icon: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL_kYDhwiFO0PyhfqVSIf6HB3aFxNF6ueZhW2fmwRwl6jyHw96vIn2UbVVzXMdyRuYLt0O7ltPjZbu0tQTejo9Hyn2skGoXucYtjcOH",
    },
    {
      name: "MP7 | Armor Core",
      rarity: "Mil-Spec",
      value: 1.3,
      icon: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8jsHf_DNk4uL5V7FhNOKSA2iUxPx4j-1gSCGn2xhw6zjSzYysICiUOgV0Cpd1TORe5BW9w922Nrux5gKLitpGz3irhnlXrnE866qixJk",
    },
    {
      name: "Tec-9 | Toxic",
      rarity: "Mil-Spec",
      value: 1.4,
      icon: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLlm5W5wipC0Py7a6hoIeKsHWyFzeJl5d59SirqqhEutDWR1N2pc3PFbgYgDMF5TbVZ5hfsk93hP7u2tQzf2t0RxSuviiJN5ydo5bwcEf1yPyH7PX0",
    },
    {
      name: "USP-S | Cortex",
      rarity: "Restricted",
      value: 5.62,
      icon: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLkjYbf7itX6vytbbZSI-WsG3SA_u1jpN5lRi67gVNz4G7Qm938cS_Da1AhXpB1EeVb4xm4mtDjN7vj4A3b2NpGyCr52i4Y8G81tMzdoYZ7",
    },
    {
      name: "Glock-18 | Vogue",
      rarity: "Restricted",
      value: 5.2,
      icon: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL2kpnj9h1Y-s2pZKtuK8-WF2KTzuBiseJ9cCW6khUz_T-GyNavdCqRawN1CMFwTOcO5hO7loXiY-zmsQKPi44QzHj22ikcvy11o7FVfFOBmfY",
    },
    {
      name: "MAC-10 | Neon Rider",
      rarity: "Restricted",
      value: 6.6,
      icon: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8n5WxrR1Y-s2jaac8cM-dC2ie0-dytfNWQyC0nQlp5DzTntmgdC7COABxX5NxQrUOtUS5w4LgMu6zsVCK2IJCmyisjitM6DErvbicsEA0SQ",
    },
    {
      name: "Desert Eagle | Mecha Industries",
      rarity: "Restricted",
      value: 7.15,
      icon: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL1m5fn8Sdk6OGRbKFsJ_yWMWqVwuZ3j-1gSCGn20h042vSyY2tdyjCZwIlXJBxQeNe4EWxxoHkMOq0sQGIid5Fnyr42HtXrnE8p4gbgvE",
    },
    {
      name: "Five-SeveN | Monkey Business",
      rarity: "Restricted",
      value: 6.0,
      icon: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL3l4Dl7idN6vyRa7FSJvmFC3SV1-t4j-NoQSi9lCIrujqNjsGheXmXPQcoWMFzEO5ZtUOwkILjY7yzsg3ci91DySiohn4buCht4eYET-N7rZVO80Su",
    },
    {
      name: "AK-47 | Redline",
      rarity: "Classified",
      value: 14.8,
      icon: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwlcK3wiFO0POlPPNSI_-RHGavzedxuPUnFniykEtzsWWBzoyuIiifaAchDZUjTOZe4RC_w4buM-6z7wzbgokUyzK-0H08hRGDMA",
    },
    {
      name: "M4A1-S | Decimator",
      rarity: "Classified",
      value: 18.7,
      icon: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8ypexwjFS4_ega6F_H_eAMWrEwL9JtORqRiSygRI1jDGMnYftb3iUb1dxW5ImFLNftxCxktflZLm2tgaP2otGyn_-hytOvy9q5elQV_A7uvqA6CRSoZY",
    },
    {
      name: "P250 | See Ya Later",
      rarity: "Classified",
      value: 11.3,
      icon: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLhzMOwwiFO0OL8PfRSI-mRC3WT0-F1j-1gSCGn2x9ytmzWnN6pInjGOwMlDZp0EORe5BHsx93lP7zr5wzbiI5AyXr_jS9XrnE8gQrIgng",
    },
    {
      name: "AWP | Neo-Noir",
      rarity: "Covert",
      value: 39.25,
      icon: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwiYbf_jdk7uW-V6poL_6cB3WvzedxuPUnHirrxR4l423SyI39I3KXPwdxWZclQeNZ5EXskYfnNeyw71OMi9lNzDK-0H3r66pOTw",
    },
    {
      name: "MP9 | Starlight Protector",
      rarity: "Covert",
      value: 31.9,
      icon: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8js_f-jFk4uL3V7d5IeKfB2CY1dF6ueZhW2flkUtztz_SzYypJSqRalUhDJNwQO4PsBXtx9HkN-K37w3bgohGmHn3kGoXuZ3lRdvF",
    },
    {
      name: "★ Karambit | Doppler",
      rarity: "Rare Special",
      value: 980,
      icon: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1Q7uCvZaZkNM-SA1iSze91u_FsTju_qhAmoT-Jn4bjJC_4Ml93UtZuRLQPsBawkNfiMbnl5AKMiopCnin7iCJBv31j4rkBBKEg-6zUjV3GY6p9v8dpLWT3Fg",
    },
    {
      name: "★ M9 Bayonet | Fade",
      rarity: "Rare Special",
      value: 850,
      icon: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1Wts2sab1iLvWHMWaR_uh3tORWQyC0nQlp4znQytr6cnjFbg8oC8BzRrQK50S-lNDgP-_r5wWP3t5CyX37jCIb7DErvbiJu9Hv_g",
    },
  ],
  budget: [
    {
      name: "P90 | Elite Build",
      rarity: "Mil-Spec",
      value: 1.65,
      icon: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLhx8bf_jdk_6v-V6lsM-SWHH6vzedxuPUnHyi1xE9xsGiDmdqpdnmRPwcgDZslRuAM40Trx93nNevj7gOPjdlGzzK-0H27CoeJJQ",
    },
    {
      name: "Galil AR | Signal",
      rarity: "Mil-Spec",
      value: 1.25,
      icon: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL2n5rp8SNJ0Pq3V6NsLPmfMXSZxuB3vN57Si2MmRQguynLnIqvIy-TO1UlXJMjEeAN4UGwk9DkZLnltgPYjYkTnCn6iy8buips5PFCD_QZl2QaUg",
    },
    {
      name: "Nova | Antique",
      rarity: "Mil-Spec",
      value: 1.5,
      icon: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL_kYDhwiFO0PyhfqVSIf6HB3aFxNF6ueZhW2fmwRwl6jyHw96vIn2UbVVzXMdyRuYLt0O7ltPjZbu0tQTejo9Hyn2skGoXucYtjcOH",
    },
    {
      name: "MP7 | Armor Core",
      rarity: "Mil-Spec",
      value: 1.3,
      icon: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8jsHf_DNk4uL5V7FhNOKSA2iUxPx4j-1gSCGn2xhw6zjSzYysICiUOgV0Cpd1TORe5BW9w922Nrux5gKLitpGz3irhnlXrnE866qixJk",
    },
    {
      name: "Tec-9 | Toxic",
      rarity: "Mil-Spec",
      value: 1.4,
      icon: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLlm5W5wipC0Py7a6hoIeKsHWyFzeJl5d59SirqqhEutDWR1N2pc3PFbgYgDMF5TbVZ5hfsk93hP7u2tQzf2t0RxSuviiJN5ydo5bwcEf1yPyH7PX0",
    },
    {
      name: "FAMAS | Mecha Industries",
      rarity: "Mil-Spec",
      value: 2.4,
      icon: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL3n5vh7h1c_M2oaalsM8-eC2SYwNF6ueZhW2ewwx4hsm3dz46heSjCPVUjC8chEOYMtxOwkNHiYb63swXY3Y9Nn32skGoXuc3DGOrc",
    },
    {
      name: "SG 553 | Pulse",
      rarity: "Mil-Spec",
      value: 1.9,
      icon: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLimcO1qx1Y-s29b_E4c8-DG2uDxNF6ueZhW2eykUh24jjczYqscH7GblIpCJBxF-AD4BHtxIKzM-nq5ACK3t1GyySskGoXuRyAaawM",
    },
    {
      name: "XM1014 | Entombed",
      rarity: "Mil-Spec",
      value: 1.75,
      icon: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLpk8ewrHZk7OeRcKk8cKHHMWad1OJzpN5rQzy2qhEutDWR1N-hI3yWbVRyD8YiEOVZ50TqmoKyZb7rtVfWgosQzX7-3X9K5yc4tr4cEf1yVvkijss",
    },
    {
      name: "Negev | Power Loader",
      rarity: "Mil-Spec",
      value: 1.2,
      icon: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL_m5Hl6x1Y-s2gbaNoNs-aA3eRwvpJvOhuRz39lE914j-HyYmscHLBZ1J1X5NyEbYI5Be8k4DmYuzh4AGIgo0QzSqs3TQJsHgPf9N5RQ",
    },
    {
      name: "Glock-18 | Vogue",
      rarity: "Restricted",
      value: 5.2,
      icon: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL2kpnj9h1Y-s2pZKtuK8-WF2KTzuBiseJ9cCW6khUz_T-GyNavdCqRawN1CMFwTOcO5hO7loXiY-zmsQKPi44QzHj22ikcvy11o7FVfFOBmfY",
    },
    {
      name: "USP-S | Cortex",
      rarity: "Restricted",
      value: 5.62,
      icon: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLkjYbf7itX6vytbbZSI-WsG3SA_u1jpN5lRi67gVNz4G7Qm938cS_Da1AhXpB1EeVb4xm4mtDjN7vj4A3b2NpGyCr52i4Y8G81tMzdoYZ7",
    },
    {
      name: "MAC-10 | Neon Rider",
      rarity: "Restricted",
      value: 6.6,
      icon: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8n5WxrR1Y-s2jaac8cM-dC2ie0-dytfNWQyC0nQlp5DzTntmgdC7COABxX5NxQrUOtUS5w4LgMu6zsVCK2IJCmyisjitM6DErvbicsEA0SQ",
    },
    {
      name: "Five-SeveN | Monkey Business",
      rarity: "Restricted",
      value: 6.0,
      icon: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL3l4Dl7idN6vyRa7FSJvmFC3SV1-t4j-NoQSi9lCIrujqNjsGheXmXPQcoWMFzEO5ZtUOwkILjY7yzsg3ci91DySiohn4buCht4eYET-N7rZVO80Su",
    },
    {
      name: "P250 | See Ya Later",
      rarity: "Classified",
      value: 11.3,
      icon: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLhzMOwwiFO0OL8PfRSI-mRC3WT0-F1j-1gSCGn2x9ytmzWnN6pInjGOwMlDZp0EORe5BHsx93lP7zr5wzbiI5AyXr_jS9XrnE8gQrIgng",
    },
    {
      name: "AK-47 | Redline",
      rarity: "Classified",
      value: 14.8,
      icon: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwlcK3wiFO0POlPPNSI_-RHGavzedxuPUnFniykEtzsWWBzoyuIiifaAchDZUjTOZe4RC_w4buM-6z7wzbgokUyzK-0H08hRGDMA",
    },
    {
      name: "MP9 | Starlight Protector",
      rarity: "Covert",
      value: 31.9,
      icon: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8js_f-jFk4uL3V7d5IeKfB2CY1dF6ueZhW2flkUtztz_SzYypJSqRalUhDJNwQO4PsBXtx9HkN-K37w3bgohGmHn3kGoXuZ3lRdvF",
    },
    {
      name: "★ Navaja Knife | Slaughter",
      rarity: "Rare Special",
      value: 220,
      icon: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1c9uK9cZtnIfOYBWmZx-tJsexWVSyxhxwYvzSCkpu3JSjFaQR0WZFwFOFYtBLtl4e2Nrmz4FHci4tAxCT8iipK6yc6sekKUL1lpPNhGLzFnw",
    },
  ],
  premium: [
    {
      name: "AK-47 | Neon Rider",
      rarity: "Mil-Spec",
      value: 3.5,
      icon: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwlcK3wiFO0POlV6poL_6sHG6UxPxJvOhuRz39xkQhsTnVzoygdy7Ea1UoCZQkRe9bs0brl9TvN-m0tVHYjY5CyS35jjQJsHhk4o5zcA",
    },
    {
      name: "M4A4 | Cyber Security",
      rarity: "Mil-Spec",
      value: 3.2,
      icon: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8ypexwiFO0P_6afBSI-mRC3WA1OB9j-1gSCGn2x9-527Tyt-pcnyUagQlW5JxEOIOuhjrw9XlMrixtQTd2NhNmH_5jCNXrnE8Cu1wa6c",
    },
    {
      name: "AWP | Capillary",
      rarity: "Mil-Spec",
      value: 2.8,
      icon: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwiYbf_jdk7uW-V7JoKf6sAm6Xyfo44bE5HSrmlx5z4GTUzt__I3yebQAgA8R3FuFfsBTqx9W2Y7vq5lbfjZUFk3ugIlCuqg",
    },
    {
      name: "MP5-SD | Phosphor",
      rarity: "Mil-Spec",
      value: 3.0,
      icon: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8jsPz-R1c_M2jePFSJvWAGm6GwOJJtPNgXxa_nBovp3PRzd-vdCqQOgYgCMYkRrECskLuwdfkZeqz5QKMjYwUnHj33SlI630__a9cBl0Wy4S-",
    },
    {
      name: "SSG 08 | Death's Head",
      rarity: "Mil-Spec",
      value: 2.6,
      icon: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLijZGwpR1Y-s29e6M9eM-XC2aEyf1-teBtcCW6khUz_WTXyNipeX-QOlQhXpJwFuYO4xLqxobuN7vn4QaNgthBnHn7iSJPv351o7FVSPuLyfc",
    },
    {
      name: "Desert Eagle | Mecha Industries",
      rarity: "Restricted",
      value: 7.15,
      icon: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL1m5fn8Sdk6OGRbKFsJ_yWMWqVwuZ3j-1gSCGn20h042vSyY2tdyjCZwIlXJBxQeNe4EWxxoHkMOq0sQGIid5Fnyr42HtXrnE8p4gbgvE",
    },
    {
      name: "AUG | Momentum",
      rarity: "Restricted",
      value: 8.5,
      icon: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwiYbf_jdk7uW-V6V-Kf2cGFidxOp_pewnF3nhxEt0sGnSzN76dH3GOg9xC8FyEORftRe-x9PuYurq71bW3d8UnjK-0H0YSTpMGQ",
    },
    {
      name: "FAMAS | Commemoration",
      rarity: "Restricted",
      value: 9.0,
      icon: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL3n5vh7h1c_M2oaalsM8-fC2CRwvdJt-5lSxa_nBovp3PUztn4d3qSPQ8kDMR5ROVb4xCxw9a0NLni4lCIio4QzXn32yMb6Sds_a9cBr1TwPEt",
    },
    {
      name: "USP-S | Monster Mashup",
      rarity: "Restricted",
      value: 8.0,
      icon: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLkjYbf7itX6vytbbZSI-WsG3SA_uVkv-pmXBa_nBovp3PQn46ueX3FbAB0WZMjTe9csEKwk9XvNbnl41Tcj48WzHqv3HhP5ydj_a9cBuLIfNg1",
    },
    {
      name: "Galil AR | Chromatic Aberration",
      rarity: "Restricted",
      value: 7.8,
      icon: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL2n5rp8SNJ0PG7V6NsLPmfMWSY0-F7sd55Rie4qhEutDWR1NivcH2VOAchC8B4ReZesxa5l4LlPu6z7wTa2IhHmCj4jyNJ7Sls4LscEf1yskqHCW4",
    },
    {
      name: "AK-47 | Redline",
      rarity: "Classified",
      value: 14.8,
      icon: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwlcK3wiFO0POlPPNSI_-RHGavzedxuPUnFniykEtzsWWBzoyuIiifaAchDZUjTOZe4RC_w4buM-6z7wzbgokUyzK-0H08hRGDMA",
    },
    {
      name: "M4A1-S | Decimator",
      rarity: "Classified",
      value: 18.7,
      icon: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8ypexwjFS4_ega6F_H_eAMWrEwL9JtORqRiSygRI1jDGMnYftb3iUb1dxW5ImFLNftxCxktflZLm2tgaP2otGyn_-hytOvy9q5elQV_A7uvqA6CRSoZY",
    },
    {
      name: "AWP | Asiimov",
      rarity: "Classified",
      value: 28.0,
      icon: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwiYbf_jdk7uW-V6V-Kf2cGFidxOp_pewnF3nhxEt0sGnSzN76dH3GOg9xC8FyEORftRe-x9PuYurq71bW3d8UnjK-0H0YSTpMGQ",
    },
    {
      name: "M4A4 | Hellfire",
      rarity: "Classified",
      value: 22.0,
      icon: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8ypexwiFO0P_6afBSKPWfAmGZ0-tJvOhuRz39zEp24GTXmImsInqWP1AkXpBwE7FetUTswdfkPu7h5QXXithBy32t2DQJsHhDPmtuAA",
    },
    {
      name: "AWP | Neo-Noir",
      rarity: "Covert",
      value: 39.25,
      icon: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwiYbf_jdk7uW-V6poL_6cB3WvzedxuPUnHirrxR4l423SyI39I3KXPwdxWZclQeNZ5EXskYfnNeyw71OMi9lNzDK-0H3r66pOTw",
    },
    {
      name: "AK-47 | Neon Revolution",
      rarity: "Covert",
      value: 45.0,
      icon: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwlcK3wiFO0POlPPNSIf6SHGSY2NF6ueZhW2e3w0524mjQzomreXqVbAAhWJF3RuZfuxC5x920Yurh7gONjY0RxHr4kGoXuT5bpI-V",
    },
    {
      name: "M4A1-S | Hyper Beast",
      rarity: "Covert",
      value: 52.0,
      icon: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8ypexwjFS4_ega6F_H_OGMWrEwL9JtORqRiSygRI1jDGMnYftb3iUb1dxW5ImFLNftxCxktflZLm2tgaP2otGyn_-hytOvy9q5elQV_A7uvqA6CRSoZY",
    },
    {
      name: "★ Butterfly Knife | Fade",
      rarity: "Rare Special",
      value: 1400,
      icon: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1Z-ua6bbZrLOmsD2avx-9ytd5lRi67gVNwsDvSwtqqc3iXZg4kCZYjReYLtRbum9XgYuvm5wbWjtgUzCn3iSsf8G81tFEeH9rw",
    },
    {
      name: "★ Karambit | Tiger Tooth",
      rarity: "Rare Special",
      value: 1100,
      icon: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1Q7uCvZaZkNM-SAFiEyOlzot5mXSi9khgYvzSCkpu3eC3BbwUmCcMlQbMD4xG_w9zkPu7gsQXe2YJFzHqqjixL5ylr4ukAWb1lpPNV9oeSnQ",
    },
    {
      name: "★ M9 Bayonet | Fade",
      rarity: "Rare Special",
      value: 850,
      icon: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1Wts2sab1iLvWHMWaR_uh3tORWQyC0nQlp4znQytr6cnjFbg8oC8BzRrQK50S-lNDgP-_r5wWP3t5CyX37jCIb7DErvbiJu9Hv_g",
    },
  ],
  elite: [
    {
      name: "AWP | Chromatic Aberration",
      rarity: "Mil-Spec",
      value: 4.0,
      icon: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwiYbf_jdk7uW-V6dlMv-eD1iAyOB9j-1gSCGn2x9ytmzWnN6pInjGOwMlDZp0EORe5BHsx93lP7zr5wzbiI5AyXr_jS9XrnE8Cu1wa6c",
    },
    {
      name: "AK-47 | Uncharted",
      rarity: "Mil-Spec",
      value: 3.8,
      icon: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwlcK3wiFO0POlPPNSIeqHC2SvzedxuPUnFnCwwBl_5D_Syon8dnyUaQUlD5oiQ7ECuxW7l920ZL-w4AfX2IlByTK-0H0PRM7cOA",
    },
    {
      name: "M4A1-S | Nightmare",
      rarity: "Mil-Spec",
      value: 4.2,
      icon: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8ypexwjFS4_ega6F_H_OGMWrEwL9lj-9gSCGnmBw1tgKJk4jxNWXCbAUpXpp0FrYPthC7k4fnZOm04laMjYxHn3r52HxJ6i065e0FVKV05OSJ2IHiKyzQ",
    },
    {
      name: "MP5-SD | Phosphor",
      rarity: "Mil-Spec",
      value: 3.0,
      icon: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8jsPz-R1c_M2jePFSJvWAGm6GwOJJtPNgXxa_nBovp3PRzd-vdCqQOgYgCMYkRrECskLuwdfkZeqz5QKMjYwUnHj33SlI630__a9cBl0Wy4S-",
    },
    {
      name: "Desert Eagle | Code Red",
      rarity: "Restricted",
      value: 12.0,
      icon: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL1m5fn8Sdk6OGRbKFsJ_yWMWaXxvxzo_JmXRa_nBovp3PRmNj4c3mTb1RxC5cjF-EItRnrlNzkYrnk5gaI3Y0UmyX52H9K7ixs_a9cBsGEcOCn",
    },
    {
      name: "AUG | Momentum",
      rarity: "Restricted",
      value: 8.5,
      icon: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwiYbf_jdk7uW-V6V-Kf2cGFidxOp_pewnF3nhxEt0sGnSzN76dH3GOg9xC8FyEORftRe-x9PuYurq71bW3d8UnjK-0H0YSTpMGQ",
    },
    {
      name: "M4A4 | In Living Color",
      rarity: "Restricted",
      value: 10.0,
      icon: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8ypexwiFO0P_6afBSLP-FC1icyOl-pK84GH2wxhty4DjcyNuhdHyXbAVxW8QjTbEMthC8kNa0MLmzs1Hbj95E02yg2bbWGcKW",
    },
    {
      name: "Glock-18 | Neo-Noir",
      rarity: "Restricted",
      value: 9.5,
      icon: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL2kpnj9h1Y-s2pZKtuK8-dAW6C_uJ_t-l9AXznwh9zsjjSn9j9dH-eb1V0CsF3QrNZ4xW8ltPlM-7h4QbYit5NzyzgznQecekkTuo",
    },
    {
      name: "AWP | Asiimov",
      rarity: "Classified",
      value: 28.0,
      icon: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwiYbf_jdk7uW-V6V-Kf2cGFidxOp_pewnF3nhxEt0sGnSzN76dH3GOg9xC8FyEORftRe-x9PuYurq71bW3d8UnjK-0H0YSTpMGQ",
    },
    {
      name: "AK-47 | Fuel Injector",
      rarity: "Classified",
      value: 32.0,
      icon: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwlcK3wiVI0POlPPNSM-WDC3WTye9kt-RtcCW6khUz_WuGy9_8dHuRbg5xW5IjQ-BYshK9mta0NLmw4lDa2o0Wni_3iy4f6np1o7FVB0pWHHg",
    },
    {
      name: "M4A4 | Hellfire",
      rarity: "Classified",
      value: 22.0,
      icon: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8ypexwiFO0P_6afBSKPWfAmGZ0-tJvOhuRz39zEp24GTXmImsInqWP1AkXpBwE7FetUTswdfkPu7h5QXXithBy32t2DQJsHhDPmtuAA",
    },
    {
      name: "M4A1-S | Hot Rod",
      rarity: "Classified",
      value: 35.0,
      icon: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8ypexwjFS4_ega6F_H_eAMWrEwL9JtORqRiSygRI1jDGMnYftb3iUb1dxW5ImFLNftxCxktflZLm2tgaP2otGyn_-hytOvy9q5elQV_A7uvqA6CRSoZY",
    },
    {
      name: "AK-47 | Neon Revolution",
      rarity: "Covert",
      value: 45.0,
      icon: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwlcK3wiFO0POlPPNSIf6SHGSY2NF6ueZhW2e3w0524mjQzomreXqVbAAhWJF3RuZfuxC5x920Yurh7gONjY0RxHr4kGoXuT5bpI-V",
    },
    {
      name: "M4A1-S | Hyper Beast",
      rarity: "Covert",
      value: 52.0,
      icon: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8ypexwjFS4_ega6F_H_OGMWrEwL9JtORqRiSygRI1jDGMnYftb3iUb1dxW5ImFLNftxCxktflZLm2tgaP2otGyn_-hytOvy9q5elQV_A7uvqA6CRSoZY",
    },
    {
      name: "AWP | Dragon Lore",
      rarity: "Covert",
      value: 1800.0,
      icon: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwiYbf_jdk4veqYaF7IfysCnWRxuF4j-B-Xxa_nBovp3PBovp3PWyt2oJ32QPQciDZUhReUM5hLskdy2Pu_n4wLe2doXm3j-2i5A7X5i_a9cBuWkb97d",
    },
    {
      name: "AK-47 | Wild Lotus",
      rarity: "Covert",
      value: 650.0,
      icon: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwlcK3wiFO0POlPPNSIf7OHG2X3_edxuPUnFniykEtzsWWBzoyuIiifaAchDZUjTOZe4RC_w4buM-6z7wzbgokUyzK-0H08hRGDMA",
    },
    {
      name: "★ Karambit | Doppler",
      rarity: "Rare Special",
      value: 980,
      icon: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1Q7uCvZaZkNM-SA1iSze91u_FsTju_qhAmoT-Jn4bjJC_4Ml93UtZuRLQPsBawkNfiMbnl5AKMiopCnin7iCJBv31j4rkBBKEg-6zUjV3GY6p9v8dpLWT3Fg",
    },
    {
      name: "★ Butterfly Knife | Fade",
      rarity: "Rare Special",
      value: 1400,
      icon: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1Z-ua6bbZrLOmsD2avx-9ytd5lRi67gVNwsDvSwtqqc3iXZg4kCZYjReYLtRbum9XgYuvm5wbWjtgUzCn3iSsf8G81tFEeH9rw",
    },
    {
      name: "★ Karambit | Tiger Tooth",
      rarity: "Rare Special",
      value: 2200,
      icon: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1Q7uCvZaZkNM-SAFiEyOlzot5mXSi9khgYvzSCkpu3eC3BbwUmCcMlQbMD4xG_w9zkPu7gsQXe2YJFzHqqjixL5ylr4ukAWb1lpPNV9oeSnQ",
    },
    {
      name: "★ M9 Bayonet | Fade",
      rarity: "Rare Special",
      value: 1900,
      icon: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1Wts2sab1iLvWHMWaR_uh3tORWQyC0nQlp4znQytr6cnjFbg8oC8BzRrQK50S-lNDgP-_r5wWP3t5CyX37jCIb7DErvbiJu9Hv_g",
    },
  ],
};

export const SKINS = [
  {
    name: "AK-47 | Redline",
    rarity: "Classified",
    value: 14.8,
    icon: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwlcK3wiFO0POlPPNSI_-RHGavzedxuPUnFniykEtzsWWBzoyuIiifaAchDZUjTOZe4RC_w4buM-6z7wzbgokUyzK-0H08hRGDMA",
  },
  {
    name: "M4A1-S | Decimator",
    rarity: "Classified",
    value: 18.7,
    icon: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8ypexwjFS4_ega6F_H_eAMWrEwL9JtORqRiSygRI1jDGMnYftb3iUb1dxW5ImFLNftxCxktflZLm2tgaP2otGyn_-hytOvy9q5elQV_A7uvqA6CRSoZY",
  },
  {
    name: "AWP | Neo-Noir",
    rarity: "Covert",
    value: 39.25,
    icon: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwiYbf_jdk7uW-V6poL_6cB3WvzedxuPUnHirrxR4l423SyI39I3KXPwdxWZclQeNZ5EXskYfnNeyw71OMi9lNzDK-0H3r66pOTw",
  },
  {
    name: "USP-S | Cortex",
    rarity: "Restricted",
    value: 5.62,
    icon: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLkjYbf7itX6vytbbZSI-WsG3SA_u1jpN5lRi67gVNz4G7Qm938cS_Da1AhXpB1EeVb4xm4mtDjN7vj4A3b2NpGyCr52i4Y8G81tMzdoYZ7",
  },
  {
    name: "Desert Eagle | Mecha Industries",
    rarity: "Restricted",
    value: 7.15,
    icon: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL1m5fn8Sdk6OGRbKFsJ_yWMWqVwuZ3j-1gSCGn20h042vSyY2tdyjCZwIlXJBxQeNe4EWxxoHkMOq0sQGIid5Fnyr42HtXrnE8p4gbgvE",
  },
  {
    name: "Glock-18 | Vogue",
    rarity: "Restricted",
    value: 5.2,
    icon: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL2kpnj9h1Y-s2pZKtuK8-WF2KTzuBiseJ9cCW6khUz_T-GyNavdCqRawN1CMFwTOcO5hO7loXiY-zmsQKPi44QzHj22ikcvy11o7FVfFOBmfY",
  },
  {
    name: "P250 | See Ya Later",
    rarity: "Classified",
    value: 11.3,
    icon: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLhzMOwwiFO0OL8PfRSI-mRC3WT0-F1j-1gSCGn2x9ytmzWnN6pInjGOwMlDZp0EORe5BHsx93lP7zr5wzbiI5AyXr_jS9XrnE8gQrIgng",
  },
  {
    name: "MP9 | Starlight Protector",
    rarity: "Covert",
    value: 31.9,
    icon: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8js_f-jFk4uL3V7d5IeKfB2CY1dF6ueZhW2flkUtztz_SzYypJSqRalUhDJNwQO4PsBXtx9HkN-K37w3bgohGmHn3kGoXuZ3lRdvF",
  },
  {
    name: "MAC-10 | Neon Rider",
    rarity: "Restricted",
    value: 6.6,
    icon: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8n5WxrR1Y-s2jaac8cM-dC2ie0-dytfNWQyC0nQlp5DzTntmgdC7COABxX5NxQrUOtUS5w4LgMu6zsVCK2IJCmyisjitM6DErvbicsEA0SQ",
  },
  {
    name: "FAMAS | Mecha Industries",
    rarity: "Mil-Spec",
    value: 2.4,
    icon: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL3n5vh7h1c_M2oaalsM8-eC2SYwNF6ueZhW2ewwx4hsm3dz46heSjCPVUjC8chEOYMtxOwkNHiYb63swXY3Y9Nn32skGoXuc3DGOrc",
  },
  {
    name: "SG 553 | Pulse",
    rarity: "Mil-Spec",
    value: 1.9,
    icon: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLimcO1qx1Y-s29b_E4c8-DG2uDxNF6ueZhW2eykUh24jjczYqscH7GblIpCJBxF-AD4BHtxIKzM-nq5ACK3t1GyySskGoXuRyAaawM",
  },
  {
    name: "P90 | Elite Build",
    rarity: "Mil-Spec",
    value: 1.65,
    icon: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLhx8bf_jdk_6v-V6lsM-SWHH6vzedxuPUnHyi1xE9xsGiDmdqpdnmRPwcgDZslRuAM40Trx93nNevj7gOPjdlGzzK-0H27CoeJJQ",
  },
  {
    name: "Galil AR | Signal",
    rarity: "Mil-Spec",
    value: 1.25,
    icon: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL2n5rp8SNJ0Pq3V6NsLPmfMXSZxuB3vN57Si2MmRQguynLnIqvIy-TO1UlXJMjEeAN4UGwk9DkZLnltgPYjYkTnCn6iy8buips5PFCD_QZl2QaUg",
  },
  {
    name: "XM1014 | Entombed",
    rarity: "Mil-Spec",
    value: 1.75,
    icon: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLpk8ewrHZk7OeRcKk8cKHHMWad1OJzpN5rQzy2qhEutDWR1N-hI3yWbVRyD8YiEOVZ50TqmoKyZb7rtVfWgosQzX7-3X9K5yc4tr4cEf1yVvkijss",
  },
  {
    name: "★ Karambit | Doppler",
    rarity: "Rare Special",
    value: 980,
    icon: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1Q7uCvZaZkNM-SA1iSze91u_FsTju_qhAmoT-Jn4bjJC_4Ml93UtZuRLQPsBawkNfiMbnl5AKMiopCnin7iCJBv31j4rkBBKEg-6zUjV3GY6p9v8dpLWT3Fg",
  },
] as const;
