/** NIST 2022 CODATA, https://physics.nist.gov/cuu/pdf/all.pdf */
export const C = Object.freeze({
  h: 6.62607015e-34,
  c: 299792458,
  e: 1.602176634e-19,
  kB: 1.380649e-23,
  electronMass: 9.1093837139e-31,
  alphaMass: 6.644657345e-27,
  epsilon0: 8.8541878188e-12,
  bohrRadius: 5.29177210544e-11,
  rydberg: 10973731.568157,
  wien: 2.897771955e-3,
});
export const toEV = (joules: number) => joules / C.e;
export const fromEV = (ev: number) => ev * C.e;
export const toNM = (metres: number) => metres * 1e9;
