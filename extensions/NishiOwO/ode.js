// Name: ODE
// ID: nishiowoOde
// Description: 3D physics using ODE.
// By: NishiOwO
// License: BSD-3-Clause

// Repository is at https://github.com/nitro-bolt/tw-ode

(async function (Scratch) {
  "use strict";

  if (!Scratch.extensions.unsandboxed) {
    throw new Error("ODE must be run unsandboxed");
  }
  let Module;
  let dInitODE2, dCloseODE;
  let dDoCollision,
    dWorldStep,
    dWorldCreate,
    dHashSpaceCreate,
    dWorldDestroy,
    dSpaceDestroy,
    dWorldSetGravity,
    dRaycast,
    dRaycastGeom;
  let dJointGroupCreate, dJointGroupDestroy, dJointGroupEmpty;
  let dBodyCreate,
    dBodyDestroy,
    dBodyInitMass,
    dBodyGetPosition,
    dBodySetPosition,
    dBodyGetQuaternion,
    dBodySetQuaternion,
    dBodyAddForce,
    dBodyGetForce,
    dBodySetForce,
    dBodyGetLinearDamping,
    dBodyGetAngularDamping,
    dBodySetLinearDamping,
    dBodySetAngularDamping,
    dBodyIsKinematic,
    dBodySetKinematic,
    dBodySetDynamic;
  let dCreateBox,
    dCreateCapsule,
    dCreateCylinder,
    dCreateSphere,
    dCreatePlane,
    dCustomCreateTriMesh,
    dCustomCreateHeightfield;
  let dGeomCustomDestroy,
    dGeomSetBody,
    dGeomGetPosition,
    dGeomSetPosition,
    dGeomGetQuaternion,
    dGeomSetQuaternion;
  let dJointCreateBall,
    dJointCreateDBall,
    dJointCreateDHinge,
    dJointCreateFixed,
    dJointCreateHinge,
    dJointCreateHinge2,
    dJointCreateLMotor,
    dJointCreatePiston,
    dJointCreatePlane2D,
    dJointCreatePR,
    dJointCreatePU,
    dJointCreateSlider,
    dJointCreateTransmission,
    dJointCreateUniversal,
    dJointDestroy;
  let dJointAttach,
    dJointSetBallAnchor,
    dJointGetBallAnchor,
    dJointGetBallAnchor2,
    dJointSetHingeAnchor,
    dJointSetHingeAxis,
    dJointGetHingeAnchor,
    dJointGetHingeAnchor2,
    dJointGetHingeAxis,
    dJointGetHingeAngle,
    dJointSetSliderAxis,
    dJointGetSliderAxis,
    dJointSetUniversalAnchor,
    dJointSetUniversalAxis1,
    dJointSetUniversalAxis2,
    dJointGetUniversalAnchor,
    dJointGetUniversalAnchor2,
    dJointGetUniversalAxis1,
    dJointGetUniversalAxis2,
    dJointGetUniversalAngle1,
    dJointGetUniversalAngle2,
    dJointSetHinge2Anchor,
    dJointSetHinge2Axis1,
    dJointSetHinge2Axis2,
    dJointGetHinge2Anchor,
    dJointGetHinge2Anchor2,
    dJointGetHinge2Axis1,
    dJointGetHinge2Axis2,
    dJointGetHinge2Angle1,
    dJointSetPRAxis1,
    dJointGetPRAxis1,
    dJointSetPRAxis2,
    dJointGetPRAxis2,
    dJointSetPRAnchor,
    dJointGetPRAnchor,
    dJointSetPUAnchor,
    dJointGetPUAnchor,
    dJointSetPUAxis1,
    dJointGetPUAxis1,
    dJointSetPUAxis2,
    dJointGetPUAxis2,
    dJointSetPUAxis3,
    dJointGetPUAxis3,
    dJointGetPUAngle1,
    dJointGetPUAngle2,
    dJointSetPistonAnchor,
    dJointGetPistonAnchor,
    dJointGetPistonAnchor2,
    dJointSetPistonAxis,
    dJointGetPistonAxis,
    dJointGetPistonAngle,
    dJointAddPistonForce,
    dJointSetLMotorAxis,
    dJointGetLMotorAxis,
    dJointAddHingeTorque,
    dJointAddUniversalTorques,
    dJointAddSliderForce,
    dJointAddHinge2Torques,
    dJointGetTransmissionAnchor1,
    dJointGetDBallAnchor1,
    dJointGetDHingeAnchor1,
    dJointSetTransmissionAnchor1,
    dJointSetDBallAnchor1,
    dJointSetDHingeAnchor1,
    dJointGetTransmissionAnchor2,
    dJointGetDBallAnchor2,
    dJointGetDHingeAnchor2,
    dJointSetBallAnchor2,
    dJointSetTransmissionAnchor2,
    dJointSetDBallAnchor2,
    dJointSetDHingeAnchor2,
    dJointGetTransmissionAxis1,
    dJointGetDHingeAxis,
    dJointSetTransmissionAxis1,
    dJointSetDHingeAxis,
    dJointGetTransmissionAxis2,
    dJointSetTransmissionAxis2,
    dJointGetPRAngle,
    dJointGetTransmissionAngle1,
    dJointGetHingeAngle2,
    dJointGetTransmissionAngle2,
    dJointAddPRTorque,
    dJointAddPUTorques;
  let ode;
  let embedded = false;
  var ODEWASM;
  let worlds = {};
  let geoms = {};
  let bodies = {};
  let joints = {};
  const blk_array =
    Scratch.BlockType[Scratch.extensions.isNitroBolt ? "ARRAY" : "REPORTER"];
  const arg_array =
    Scratch.ArgumentType[Scratch.extensions.isNitroBolt ? "ARRAY" : "STRING"];
  const from_array = Scratch.extensions.isNitroBolt
    ? (x) => x
    : (x) => JSON.stringify(x);
  const to_f32array = Scratch.extensions.isNitroBolt
    ? Scratch.Cast.toFloat32Array
    : (x) => {
        try {
          const json = JSON.parse(x);

          if (!Array.isArray(json)) return new Float32Array([]);

          return json;
        } catch {
          return new Float32Array([]);
        }
      };

  /* DO NOT REMOVE THE COMMENT BELOW!!! */
  /* EMBED ODEJS.JS HERE */

  if (embedded) {
    ode = ODEWASM;
  } else {
    ode = await Scratch.external.evalAndReturn(
      "https://raw.githubusercontent.com/Nitro-Bolt/tw-ode/d580df0057453d3d950c9b65c5672fbe4a160768/odejs.js",
      "ODEWASM"
    );
  }

  Module = await ode();
  dInitODE2 = Module.cwrap("dInitODE2", "number", ["number"]);
  dCloseODE = Module.cwrap("dCloseODE", null, []);

  dWorldStep = Module.cwrap("dWorldStep", null, ["number", "number"]);
  dWorldCreate = Module.cwrap("dWorldCreate", "number", []);
  dHashSpaceCreate = Module.cwrap("dHashSpaceCreate", "number", ["number"]);
  dWorldDestroy = Module.cwrap("dWorldDestroy", null, ["number"]);
  dSpaceDestroy = Module.cwrap("dSpaceDestroy", null, ["number"]);
  dWorldSetGravity = Module.cwrap("dWorldSetGravity", null, [
    "number",
    "number",
    "number",
    "number",
  ]);
  dRaycast = Module.cwrap("dRaycast", "number", [
    "number",
    "number",
    "number",
    "number",
    "number",
    "number",
    "number",
  ]);
  dRaycastGeom = Module.cwrap("dRaycastGeom", "number", [
    "number",
    "number",
    "number",
    "number",
    "number",
    "number",
    "number",
    "number",
  ]);

  dJointGroupCreate = Module.cwrap("dJointGroupCreate", "number", ["number"]);
  dJointGroupDestroy = Module.cwrap("dJointGroupDestroy", null, ["number"]);
  dJointGroupEmpty = Module.cwrap("dJointGroupEmpty", null, ["number"]);

  dDoCollision = Module.cwrap("dDoCollision", null, [
    "number",
    "number",
    "number",
  ]);

  dBodyCreate = Module.cwrap("dBodyCreate", "number", ["number"]);
  dBodyDestroy = Module.cwrap("dBodyDestroy", null, ["number"]);
  dBodyInitMass = Module.cwrap("dBodyInitMass", null, ["number", "number"]);
  dBodyGetPosition = Module.cwrap("dBodyGetPosition", "number", ["number"]);
  dBodySetPosition = Module.cwrap("dBodySetPosition", "number", [
    "number",
    "number",
    "number",
    "number",
  ]);
  dBodyGetQuaternion = Module.cwrap("dBodyGetQuaternion", "number", ["number"]);
  dBodySetQuaternion = Module.cwrap("dBodySetQuaternion", null, [
    "number",
    "number",
  ]);
  dBodyAddForce = Module.cwrap("dBodyAddForce", "number", [
    "number",
    "number",
    "number",
    "number",
  ]);
  dBodyGetForce = Module.cwrap("dBodyGetForce", "number", ["number"]);
  dBodySetForce = Module.cwrap("dBodySetForce", "number", [
    "number",
    "number",
    "number",
    "number",
  ]);
  dBodyGetAngularDamping = Module.cwrap("dBodyGetAngularDamping", "number", [
    "number",
  ]);
  dBodySetAngularDamping = Module.cwrap("dBodySetAngularDamping", null, [
    "number",
    "number",
  ]);
  dBodyGetLinearDamping = Module.cwrap("dBodyGetLinearDamping", "number", [
    "number",
  ]);
  dBodySetLinearDamping = Module.cwrap("dBodySetLinearDamping", null, [
    "number",
    "number",
  ]);
  dBodyIsKinematic = Module.cwrap("dBodyIsKinematic", "number", []);
  dBodySetKinematic = Module.cwrap("dBodySetKinematic", null, ["number"]);
  dBodySetDynamic = Module.cwrap("dBodySetDynamic", null, ["number"]);

  dCreateBox = Module.cwrap("dCreateBox", "number", [
    "number",
    "number",
    "number",
    "number",
  ]);
  dCreateCapsule = Module.cwrap("dCreateCapsule", "number", [
    "number",
    "number",
    "number",
  ]);
  dCreateCylinder = Module.cwrap("dCreateCylinder", "number", [
    "number",
    "number",
    "number",
  ]);
  dCreateSphere = Module.cwrap("dCreateSphere", "number", ["number", "number"]);
  dCreatePlane = Module.cwrap("dCreatePlane", "number", [
    "number",
    "number",
    "number",
    "number",
    "number",
  ]);
  dCustomCreateTriMesh = Module.cwrap("dCustomCreateTriMesh", "number", [
    "number",
    "number",
    "number",
    "number",
    "number",
  ]);
  dCustomCreateHeightfield = Module.cwrap(
    "dCustomCreateHeightfield",
    "number",
    [
      "number",
      "number",
      "number",
      "number",
      "number",
      "number",
      "number",
      "number",
      "number",
      "number",
      "number",
    ]
  );

  dGeomCustomDestroy = Module.cwrap("dGeomCustomDestroy", null, ["number"]);
  dGeomSetBody = Module.cwrap("dGeomSetBody", null, ["number", "number"]);
  dGeomGetPosition = Module.cwrap("dGeomGetPosition", "number", ["number"]);
  dGeomSetPosition = Module.cwrap("dGeomSetPosition", "number", [
    "number",
    "number",
    "number",
    "number",
  ]);
  dGeomGetQuaternion = Module.cwrap("dGeomGetQuaternion", null, [
    "number",
    "number",
  ]);
  dGeomSetQuaternion = Module.cwrap("dGeomSetQuaternion", null, [
    "number",
    "number",
  ]);

  dJointCreateBall = Module.cwrap("dJointCreateBall", "number", [
    "number",
    "number",
  ]);
  dJointCreateDBall = Module.cwrap("dJointCreateDBall", "number", [
    "number",
    "number",
  ]);
  dJointCreateDHinge = Module.cwrap("dJointCreateDHinge", "number", [
    "number",
    "number",
  ]);
  dJointCreateFixed = Module.cwrap("dJointCreateFixed", "number", [
    "number",
    "number",
  ]);
  dJointCreateHinge = Module.cwrap("dJointCreateHinge", "number", [
    "number",
    "number",
  ]);
  dJointCreateHinge2 = Module.cwrap("dJointCreateHinge2", "number", [
    "number",
    "number",
  ]);
  dJointCreateLMotor = Module.cwrap("dJointCreateLMotor", "number", [
    "number",
    "number",
  ]);
  dJointCreatePiston = Module.cwrap("dJointCreatePiston", "number", [
    "number",
    "number",
  ]);
  dJointCreatePlane2D = Module.cwrap("dJointCreatePlane2D", "number", [
    "number",
    "number",
  ]);
  dJointCreatePR = Module.cwrap("dJointCreatePR", "number", [
    "number",
    "number",
  ]);
  dJointCreatePU = Module.cwrap("dJointCreatePU", "number", [
    "number",
    "number",
  ]);
  dJointCreateSlider = Module.cwrap("dJointCreateSlider", "number", [
    "number",
    "number",
  ]);
  dJointCreateTransmission = Module.cwrap(
    "dJointCreateTransmission",
    "number",
    ["number", "number"]
  );
  dJointCreateUniversal = Module.cwrap("dJointCreateUniversal", "number", [
    "number",
    "number",
  ]);
  dJointDestroy = Module.cwrap("dJointDestroy", "number", ["number", "number"]);

  dJointGetTransmissionAnchor1 = Module.cwrap(
    "dJointGetTransmissionAnchor1",
    null,
    ["number", "number"]
  );
  dJointGetDBallAnchor1 = Module.cwrap("dJointGetDBallAnchor1", null, [
    "number",
    "number",
  ]);
  dJointGetDHingeAnchor1 = Module.cwrap("dJointGetDHingeAnchor1", null, [
    "number",
    "number",
  ]);
  dJointSetTransmissionAnchor1 = Module.cwrap(
    "dJointSetTransmissionAnchor1",
    null,
    ["number", "number", "number", "number"]
  );
  dJointSetDBallAnchor1 = Module.cwrap("dJointSetDBallAnchor1", null, [
    "number",
    "number",
    "number",
    "number",
  ]);
  dJointSetDHingeAnchor1 = Module.cwrap("dJointSetDHingeAnchor1", null, [
    "number",
    "number",
    "number",
    "number",
  ]);
  dJointGetTransmissionAnchor2 = Module.cwrap(
    "dJointGetTransmissionAnchor2",
    null,
    ["number", "number"]
  );
  dJointGetDBallAnchor2 = Module.cwrap("dJointGetDBallAnchor2", null, [
    "number",
    "number",
  ]);
  dJointGetDHingeAnchor2 = Module.cwrap("dJointGetDHingeAnchor2", null, [
    "number",
    "number",
  ]);
  dJointSetBallAnchor2 = Module.cwrap("dJointSetBallAnchor2", null, [
    "number",
    "number",
    "number",
    "number",
  ]);
  dJointSetTransmissionAnchor2 = Module.cwrap(
    "dJointSetTransmissionAnchor2",
    null,
    ["number", "number", "number", "number"]
  );
  dJointSetDBallAnchor2 = Module.cwrap("dJointSetDBallAnchor2", null, [
    "number",
    "number",
    "number",
    "number",
  ]);
  dJointSetDHingeAnchor2 = Module.cwrap("dJointSetDHingeAnchor2", null, [
    "number",
    "number",
    "number",
    "number",
  ]);
  dJointGetTransmissionAxis1 = Module.cwrap(
    "dJointGetTransmissionAxis1",
    null,
    ["number", "number"]
  );
  dJointGetDHingeAxis = Module.cwrap("dJointGetDHingeAxis", null, [
    "number",
    "number",
  ]);
  dJointSetTransmissionAxis1 = Module.cwrap(
    "dJointSetTransmissionAxis1",
    null,
    ["number", "number", "number", "number"]
  );
  dJointSetDHingeAxis = Module.cwrap("dJointSetDHingeAxis", null, [
    "number",
    "number",
    "number",
    "number",
  ]);
  dJointGetTransmissionAxis2 = Module.cwrap(
    "dJointGetTransmissionAxis2",
    null,
    ["number", "number"]
  );
  dJointSetTransmissionAxis2 = Module.cwrap(
    "dJointSetTransmissionAxis2",
    null,
    ["number", "number", "number", "number"]
  );
  dJointGetPRAngle = Module.cwrap("dJointGetPRAngle", "number", ["number"]);
  dJointGetTransmissionAngle1 = Module.cwrap(
    "dJointGetTransmissionAngle1",
    "number",
    ["number"]
  );
  dJointGetTransmissionAngle2 = Module.cwrap(
    "dJointGetTransmissionAngle2",
    "number",
    ["number"]
  );
  dJointAddPRTorque = Module.cwrap("dJointAddPRTorque", null, [
    "number",
    "number",
  ]);
  dJointAddPUTorques = Module.cwrap("dJointAddPUTorques", null, [
    "number",
    "number",
    "number",
  ]);
  dJointAttach = Module.cwrap("dJointAttach", null, [
    "number",
    "number",
    "number",
  ]);
  dJointSetBallAnchor = Module.cwrap("dJointSetBallAnchor", null, [
    "number",
    "number",
    "number",
    "number",
  ]);
  dJointGetBallAnchor = Module.cwrap("dJointGetBallAnchor", null, [
    "number",
    "number",
  ]);
  dJointGetBallAnchor2 = Module.cwrap("dJointGetBallAnchor2", null, [
    "number",
    "number",
  ]);
  dJointSetHingeAnchor = Module.cwrap("dJointSetHingeAnchor", null, [
    "number",
    "number",
    "number",
    "number",
  ]);
  dJointSetHingeAxis = Module.cwrap("dJointSetHingeAxis", null, [
    "number",
    "number",
    "number",
    "number",
  ]);
  dJointGetHingeAnchor = Module.cwrap("dJointGetHingeAnchor", null, [
    "number",
    "number",
  ]);
  dJointGetHingeAnchor2 = Module.cwrap("dJointGetHingeAnchor2", null, [
    "number",
    "number",
  ]);
  dJointGetHingeAxis = Module.cwrap("dJointGetHingeAxis", null, [
    "number",
    "number",
  ]);
  dJointGetHingeAngle = Module.cwrap("dJointGetHingeAngle", "number", [
    "number",
  ]);
  dJointSetSliderAxis = Module.cwrap("dJointSetSliderAxis", null, [
    "number",
    "number",
    "number",
    "number",
  ]);
  dJointGetSliderAxis = Module.cwrap("dJointGetSliderAxis", null, [
    "number",
    "number",
  ]);
  dJointSetUniversalAnchor = Module.cwrap("dJointSetUniversalAnchor", null, [
    "number",
    "number",
    "number",
    "number",
  ]);
  dJointSetUniversalAxis1 = Module.cwrap("dJointSetUniversalAxis1", null, [
    "number",
    "number",
    "number",
    "number",
  ]);
  dJointSetUniversalAxis2 = Module.cwrap("dJointSetUniversalAxis2", null, [
    "number",
    "number",
    "number",
    "number",
  ]);
  dJointGetUniversalAnchor = Module.cwrap("dJointGetUniversalAnchor", null, [
    "number",
    "number",
  ]);
  dJointGetUniversalAnchor2 = Module.cwrap("dJointGetUniversalAnchor2", null, [
    "number",
    "number",
  ]);
  dJointGetUniversalAxis1 = Module.cwrap("dJointGetUniversalAxis1", null, [
    "number",
    "number",
  ]);
  dJointGetUniversalAxis2 = Module.cwrap("dJointGetUniversalAxis2", null, [
    "number",
    "number",
  ]);
  dJointGetUniversalAngle1 = Module.cwrap(
    "dJointGetUniversalAngle1",
    "number",
    ["number"]
  );
  dJointGetUniversalAngle2 = Module.cwrap(
    "dJointGetUniversalAngle2",
    "number",
    ["number"]
  );
  dJointSetHinge2Anchor = Module.cwrap("dJointSetHinge2Anchor", null, [
    "number",
    "number",
    "number",
    "number",
  ]);
  dJointSetHinge2Axis1 = Module.cwrap("dJointSetHinge2Axis1", null, [
    "number",
    "number",
    "number",
    "number",
  ]);
  dJointSetHinge2Axis2 = Module.cwrap("dJointSetHinge2Axis2", null, [
    "number",
    "number",
    "number",
    "number",
  ]);
  dJointGetHinge2Anchor = Module.cwrap("dJointGetHinge2Anchor", null, [
    "number",
    "number",
  ]);
  dJointGetHinge2Anchor2 = Module.cwrap("dJointGetHinge2Anchor2", null, [
    "number",
    "number",
  ]);
  dJointGetHinge2Axis1 = Module.cwrap("dJointGetHinge2Axis1", null, [
    "number",
    "number",
  ]);
  dJointGetHinge2Axis2 = Module.cwrap("dJointGetHinge2Axis2", null, [
    "number",
    "number",
  ]);
  dJointGetHinge2Angle1 = Module.cwrap("dJointGetHinge2Angle1", "number", [
    "number",
  ]);
  dJointSetPRAxis1 = Module.cwrap("dJointSetPRAxis1", null, [
    "number",
    "number",
    "number",
    "number",
  ]);
  dJointGetPRAxis1 = Module.cwrap("dJointGetPRAxis1", null, [
    "number",
    "number",
  ]);
  dJointSetPRAxis2 = Module.cwrap("dJointSetPRAxis2", null, [
    "number",
    "number",
    "number",
    "number",
  ]);
  dJointGetPRAxis2 = Module.cwrap("dJointGetPRAxis2", null, [
    "number",
    "number",
  ]);
  dJointSetPRAnchor = Module.cwrap("dJointSetPRAnchor", null, [
    "number",
    "number",
    "number",
    "number",
  ]);
  dJointGetPRAnchor = Module.cwrap("dJointGetPRAnchor", null, [
    "number",
    "number",
  ]);
  dJointSetPUAnchor = Module.cwrap("dJointSetPUAnchor", null, [
    "number",
    "number",
    "number",
    "number",
  ]);
  dJointGetPUAnchor = Module.cwrap("dJointGetPUAnchor", null, [
    "number",
    "number",
  ]);
  dJointSetPUAxis1 = Module.cwrap("dJointSetPUAxis1", null, [
    "number",
    "number",
    "number",
    "number",
  ]);
  dJointGetPUAxis1 = Module.cwrap("dJointGetPUAxis1", null, [
    "number",
    "number",
  ]);
  dJointSetPUAxis2 = Module.cwrap("dJointSetPUAxis2", null, [
    "number",
    "number",
    "number",
    "number",
  ]);
  dJointGetPUAxis2 = Module.cwrap("dJointGetPUAxis2", null, [
    "number",
    "number",
  ]);
  dJointSetPUAxis3 = Module.cwrap("dJointSetPUAxis3", null, [
    "number",
    "number",
    "number",
    "number",
  ]);
  dJointGetPUAxis3 = Module.cwrap("dJointGetPUAxis3", null, [
    "number",
    "number",
  ]);
  dJointGetPUAngle1 = Module.cwrap("dJointGetPUAngle1", "number", ["number"]);
  dJointGetPUAngle2 = Module.cwrap("dJointGetPUAngle2", "number", ["number"]);
  dJointSetPistonAnchor = Module.cwrap("dJointSetPistonAnchor", null, [
    "number",
    "number",
    "number",
    "number",
  ]);
  dJointGetPistonAnchor = Module.cwrap("dJointGetPistonAnchor", null, [
    "number",
    "number",
  ]);
  dJointGetPistonAnchor2 = Module.cwrap("dJointGetPistonAnchor2", null, [
    "number",
    "number",
  ]);
  dJointSetPistonAxis = Module.cwrap("dJointSetPistonAxis", null, [
    "number",
    "number",
    "number",
    "number",
  ]);
  dJointGetPistonAxis = Module.cwrap("dJointGetPistonAxis", null, [
    "number",
    "number",
  ]);
  dJointGetPistonAngle = Module.cwrap("dJointGetPistonAngle", "number", [
    "number",
  ]);
  dJointAddPistonForce = Module.cwrap("dJointAddPistonForce", null, [
    "number",
    "number",
  ]);
  dJointSetLMotorAxis = Module.cwrap("dJointSetLMotorAxis", null, [
    "number",
    "number",
    "number",
    "number",
    "number",
    "number",
  ]);
  dJointGetLMotorAxis = Module.cwrap("dJointGetLMotorAxis", null, [
    "number",
    "number",
    "number",
  ]);
  dJointAddHingeTorque = Module.cwrap("dJointAddHingeTorque", null, [
    "number",
    "number",
  ]);
  dJointAddUniversalTorques = Module.cwrap("dJointAddUniversalTorques", null, [
    "number",
    "number",
    "number",
  ]);
  dJointAddSliderForce = Module.cwrap("dJointAddSliderForce", null, [
    "number",
    "number",
  ]);
  dJointAddHinge2Torques = Module.cwrap("dJointAddHinge2Torques", null, [
    "number",
    "number",
    "number",
  ]);

  function new_obj_key(obj) {
    let n;

    do {
      n =
        "0x" + Math.max(1, Math.floor(Math.random() * 0xffffffff)).toString(16);
    } while (obj[n]);

    return n;
  }

  function obj_exclude(obj, key, val) {
    let ret = {};

    for (let i in obj) {
      if (obj[i][key] == val) continue;

      ret[i] = obj[i];
    }

    return ret;
  }

  function f64_view(ptr) {
    return new Float64Array(Module.HEAPF64.buffer, ptr);
  }

  function quaternion_to_euler(q) {
    /* w x y z */
    const q_w = q[0];
    const q_x = q[1];
    const q_y = q[2];
    const q_z = q[3];

    const sinr_cosp = 2 * (q_w * q_x + q_y * q_z);
    const cosr_cosp = 1 - 2 * (q_x * q_x + q_y * q_y);
    const roll = Math.atan2(sinr_cosp, cosr_cosp);

    const sinp = 2 * (q_w * q_y - q_z * q_x);

    let pitch;
    if (Math.abs(sinp) >= 1) {
      pitch = (Math.sign(sinp) * Math.PI) / 2;
    } else {
      pitch = Math.asin(sinp);
    }

    const siny_cosp = 2 * (q_w * q_z + q_x * q_y);
    const cosy_cosp = 1 - 2 * (q_y * q_y + q_z * q_z);
    const yaw = Math.atan2(siny_cosp, cosy_cosp);

    return [roll, pitch, yaw].map((x) => (x / Math.PI) * 180);
  }

  function euler_to_quaternion(e) {
    const e_x = e[0];
    const e_y = e[1];
    const e_z = e[2];

    const cx = Math.cos(e_x * 0.5);
    const sx = Math.sin(e_x * 0.5);

    const cy = Math.cos(e_y * 0.5);
    const sy = Math.sin(e_y * 0.5);

    const cz = Math.cos(e_z * 0.5);
    const sz = Math.sin(e_z * 0.5);

    return [
      cx * cy * cz + sx * sy * sz,
      sx * cy * cz - cx * sy * sz,
      cx * sy * cz + sx * cy * sz,
      cx * cy * sz - sx * sy * cz,
    ];
  }

  function bodygeom_menu_to_field(m) {
    if (m == "rotation") return "ROT";
    if (m == "quaternion") return "QUAT";
    if (m == "force") return "FORCE";
    return "POS";
  }

  function bodygeom_menu_to_func(m) {
    if (m == "rotation") return "Rotation";
    if (m == "quaternion") return "Quaternion";
    if (m == "force") return "Force";
    return "Position";
  }

  function joint_menu_to_field(m) {
    if (m == "secondary anchor") return "ANCHOR";
    if (m == "primary axis") return "AXIS";
    if (m == "secondary axis") return "AXIS";
    if (m == "teritiary axis") return "AXIS";
    return "ANCHOR";
  }

  function joint_menu_to_func(m) {
    if (m == "secondary anchor") return "SecondaryAnchor";
    if (m == "primary axis") return "PrimaryAxis";
    if (m == "secondary axis") return "SecondaryAxis";
    if (m == "teritiary axis") return "TeritiaryAxis";
    return "PrimaryAnchor";
  }

  const blockIconURI =
    "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjwhLS0gQ3JlYXRlZCB3aXRoIElua3NjYXBlIChodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy8pIC0tPgoKPHN2ZwogICB2aWV3Qm94PSIwIDAgMzIuMjEyNDM5IDMyLjIxMjQzOSIKICAgdmVyc2lvbj0iMS4xIgogICBpZD0ic3ZnMSIKICAgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIKICAgc29kaXBvZGk6ZG9jbmFtZT0ib2RlbG9nby5zdmciCiAgIGlua3NjYXBlOnZlcnNpb249IjEuNC4yIChmNDMyN2Y0LCAyMDI1LTA1LTEzKSIKICAgd2lkdGg9IjMyLjIxMjQ0IgogICBoZWlnaHQ9IjMyLjIxMjQ0IgogICB4bWxuczppbmtzY2FwZT0iaHR0cDovL3d3dy5pbmtzY2FwZS5vcmcvbmFtZXNwYWNlcy9pbmtzY2FwZSIKICAgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5zb3VyY2Vmb3JnZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkIgogICB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxzb2RpcG9kaTpuYW1lZHZpZXcKICAgICBpZD0ibmFtZWR2aWV3MSIKICAgICBwYWdlY29sb3I9IiNmZmZmZmYiCiAgICAgYm9yZGVyY29sb3I9IiMwMDAwMDAiCiAgICAgYm9yZGVyb3BhY2l0eT0iMC4yNSIKICAgICBpbmtzY2FwZTpzaG93cGFnZXNoYWRvdz0iMiIKICAgICBpbmtzY2FwZTpwYWdlb3BhY2l0eT0iMC4wIgogICAgIGlua3NjYXBlOnBhZ2VjaGVja2VyYm9hcmQ9IjAiCiAgICAgaW5rc2NhcGU6ZGVza2NvbG9yPSIjZDFkMWQxIgogICAgIGlua3NjYXBlOnpvb209IjEzLjE4MzkyNSIKICAgICBpbmtzY2FwZTpjeD0iNDYuNjA5NzkyIgogICAgIGlua3NjYXBlOmN5PSIyMy4xNzIxNTkiCiAgICAgaW5rc2NhcGU6d2luZG93LXdpZHRoPSIxOTIwIgogICAgIGlua3NjYXBlOndpbmRvdy1oZWlnaHQ9IjExMzciCiAgICAgaW5rc2NhcGU6d2luZG93LXg9Ii04IgogICAgIGlua3NjYXBlOndpbmRvdy15PSItOCIKICAgICBpbmtzY2FwZTp3aW5kb3ctbWF4aW1pemVkPSIxIgogICAgIGlua3NjYXBlOmN1cnJlbnQtbGF5ZXI9ImxheWVyMSIgLz48ZGVmcwogICAgIGlkPSJkZWZzMSI+PGNsaXBQYXRoCiAgICAgICBjbGlwUGF0aFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIKICAgICAgIGlkPSJjbGlwUGF0aDExIj48Y2lyY2xlCiAgICAgICAgIHN0eWxlPSJmaWxsOiNlYTY4MTk7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlLXdpZHRoOjAuMjcyOTcxIgogICAgICAgICBpZD0iY2lyY2xlMTEiCiAgICAgICAgIGNsaXAtcGF0aD0ibm9uZSIKICAgICAgICAgcj0iMTYuMTA2MjIiCiAgICAgICAgIGN5PSIxMzQuOTIzMzIiCiAgICAgICAgIGN4PSIzOS42MzU3IiAvPjwvY2xpcFBhdGg+PGNsaXBQYXRoCiAgICAgICBjbGlwUGF0aFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIKICAgICAgIGlkPSJjbGlwUGF0aDEyIj48Y2lyY2xlCiAgICAgICAgIHN0eWxlPSJmaWxsOiNlYTY4MTk7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlLXdpZHRoOjAuMjcyOTcxIgogICAgICAgICBpZD0iY2lyY2xlMTIiCiAgICAgICAgIGNsaXAtcGF0aD0ibm9uZSIKICAgICAgICAgcj0iMTYuMTA2MjIiCiAgICAgICAgIGN5PSIxMzQuOTIzMzIiCiAgICAgICAgIGN4PSIzOS42MzU3IiAvPjwvY2xpcFBhdGg+PGNsaXBQYXRoCiAgICAgICBjbGlwUGF0aFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIKICAgICAgIGlkPSJjbGlwUGF0aDEzIj48Y2lyY2xlCiAgICAgICAgIHN0eWxlPSJmaWxsOiNlYTY4MTk7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlLXdpZHRoOjAuMjcyOTcxIgogICAgICAgICBpZD0iY2lyY2xlMTMiCiAgICAgICAgIGNsaXAtcGF0aD0ibm9uZSIKICAgICAgICAgcj0iMTYuMTA2MjIiCiAgICAgICAgIGN5PSIxMzQuOTIzMzIiCiAgICAgICAgIGN4PSIzOS42MzU3IiAvPjwvY2xpcFBhdGg+PGNsaXBQYXRoCiAgICAgICBjbGlwUGF0aFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIKICAgICAgIGlkPSJjbGlwUGF0aDE0Ij48Y2lyY2xlCiAgICAgICAgIHN0eWxlPSJmaWxsOiNlYTY4MTk7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlLXdpZHRoOjAuMjcyOTcxIgogICAgICAgICBpZD0iY2lyY2xlMTQiCiAgICAgICAgIGNsaXAtcGF0aD0ibm9uZSIKICAgICAgICAgcj0iMTYuMTA2MjIiCiAgICAgICAgIGN5PSIxMzQuOTIzMzIiCiAgICAgICAgIGN4PSIzOS42MzU3IiAvPjwvY2xpcFBhdGg+PGNsaXBQYXRoCiAgICAgICBjbGlwUGF0aFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIKICAgICAgIGlkPSJjbGlwUGF0aDEwIj48cGF0aAogICAgICAgICBzdHlsZT0iYmFzZWxpbmUtc2hpZnQ6YmFzZWxpbmU7ZGlzcGxheTpub25lO292ZXJmbG93OnZpc2libGU7b3BhY2l0eToxO3ZlY3Rvci1lZmZlY3Q6bm9uZTtmaWxsOiNmZmZmZmY7c3Ryb2tlLXdpZHRoOjE7c3Ryb2tlLWxpbmVjYXA6c3F1YXJlO3N0cm9rZS1saW5lam9pbjpyb3VuZDtlbmFibGUtYmFja2dyb3VuZDphY2N1bXVsYXRlO3N0b3AtY29sb3I6IzAwMDAwMDtzdG9wLW9wYWNpdHk6MSIKICAgICAgICAgZD0ibSA0MC42OTUzMSwxMTcuOTI5NjkgLTAuNDE3OTY3LDAuOTA4MiAwLjQ1NTA3OSwwLjIwODk5IGMgMCwwIDEuNjQyNDg4LDAuNzQwMTMgMy4zOTY0ODIsMy4yMjQ2IDEuMzc0MjUzLDEuOTQ2NTggMi43NTQ3NTgsNS4wMDYxMSAzLjM1OTM3Niw5LjU0MTAyIC0zLjI0NTExMiwtMC4zNzYyNyAtNS42NDkxNTMsLTIuNjE3NzYgLTguNzk2ODc2LC00Ljg5ODQ0IGEgMC41MDAwNSwwLjUwMDA1IDAgMCAwIC0wLjAwMzksLTAuMDAyIGMgLTQuNTU4MDA0LC0zLjI1OTYyIC04LjEyMTQ3MiwtNC4yMDk3MiAtMTAuMzc1LC00LjI3NTM5IGwgLTAuNDk5OTk5LC0wLjAxNTYgLTAuMDI5MywxIDAuNSwwLjAxNTYgYyAyLjAwMTc5MiwwLjA1ODMgNS4zOTIzNjEsMC45MTg0OSA5LjgyNDIxOSw0LjA4Nzg5IDMuMTI1NzE1LDIuMjY1MjkgNS43MzkzNDgsNC43NjYyIDkuNDY0ODQ1LDUuMTA5MzcgMC4wNzc5NiwwLjc1ODA2IDAuMTU5MDIxLDEuNTA4MDggMC4xODk0NTIsMi4zNDc2NiAtNi41NDY2OTksMC4yNjcxOCAtMTQuNjMwODY1LDAuMzExMjYgLTI0LjU0NDkyMSwtMC42MjEwOSBsIC0wLjQ5ODA0NywtMC4wNDY5IC0wLjA5Mzc1LDAuOTk2MSAwLjQ5ODA0NiwwLjA0NjkgYyA5Ljk2NTk4MiwwLjkzNzI0IDE4LjA4NjQ0MSwwLjg5Mjk5IDI0LjY4MTY0LDAuNjIzMDUgMC4wMjM2LDAuOTMwMzggLTAuMDM4NjcsMS43ODQxNyAtMC4xMjMwNDQsMi42MTcxOCAtMS42NzEzMjcsMC4xNzQzNyAtMy4xNDE2NjIsMC42OTE5OCAtNC41MDM5MDksMS41IC0xLjU4NDAyMywwLjkzOTU4IC0zLjEwNDEwNywyLjE1MDU3IC00LjkzOTQ1MiwzLjM1MTU3IGEgMC41MDAwNSwwLjUwMDA1IDAgMCAwIC0wLjAwMiwwLjAwMiBjIC00LjM0MzczNCwyLjg3NDI2IC03LjU3NzUxOSwyLjY4Njc1IC05Ljc0ODA0OCwyLjc1IGwgLTAuNDk5OTk5LDAuMDEzNyAwLjAyOTMsMSAwLjUsLTAuMDEzNyBjIDIuMDg0NDE2LC0wLjA2MDcgNS43MTQ1MzUsMC4wOTkxIDEwLjI2OTUzMSwtMi45MTQwNiBsIDAuMDAyLC0wLjAwMiBjIDEuODc5NDEsLTEuMjMwMDIgMy4zOTk5MzksLTIuNDM5MjcgNC44OTg0MzcsLTMuMzI4MTIgMS4yMzI3NjMsLTAuNzMxMjIgMi40ODc1MDYsLTEuMTY1NDIgMy45MDAzOTEsLTEuMzQzNzUgLTEuMTg2MjE5LDcuNzEwNCAtNi41NDg4MjgsMTAuOTcwNyAtNi41NDg4MjgsMTAuOTcwNyBsIC0wLjQyNTc4MiwwLjI1OTc3IDAuNTIxNDg2LDAuODUzNTEgMC40MjU3ODIsLTAuMjU5NzYgYyAwLDAgNS44ODg3NzUsLTMuNjM5NzggNy4wNzAzMTEsLTExLjk0MzM2IDEuMTcxNDQ2LDAuMDgwNiAxLjk2OTc1OCwwLjQxOTgyIDIuNTA1ODYsMC44OTg0NCAwLjU2NjM0MSwwLjUwNTYxIDAuODg1NywxLjE2NzI1IDEuMDU4NTkyLDEuODU1NDcgMC4zNDU3ODgsMS4zNzY0MiAwLjA2ODM2LDIuNzc3MzQgMC4wNjgzNiwyLjc3NzM0IGwgLTAuMTAxNTYzLDAuNDg4MjggMC45Nzg1MTYsMC4yMDMxMyAwLjEwMTU2MSwtMC40ODgyOSBjIDAsMCAwLjMzODQxMiwtMS41NzIzOCAtMC4wNzYxNywtMy4yMjI2NSAtMC4yMDcyOTMsLTAuODI1MTQgLTAuNjEyMDE1LC0xLjY4ODY3IC0xLjM2MzI4MywtMi4zNTkzOCAtMC43MTU3OTksLTAuNjM5MDQgLTEuNzU5NDM3LC0xLjA1OTM1IC0zLjEyMzA0NiwtMS4xNTAzOSAwLjA3Nzg5LC0wLjgyMzYgMC4xNDg2OTksLTEuNjU0NzIgMC4xMjQ5OTksLTIuNTY0NDUgMi40NTk5NjEsLTAuMTE5MDQgNS41MzczMjUsLTAuMTY3OTIgNy4xMjg5MDcsLTAuMzUxNTYgbCAwLjQ5ODA0OCwtMC4wNTY2IC0wLjExNTIzNiwtMC45OTQxNCAtMC40OTYwOTQsMC4wNTg2IGMgLTEuNTYwMjgyLDAuMTgwMDMgLTQuNjIzMjcsMC4yMjgwMSAtNy4wNjA1NDUsMC4zNDU3IC0wLjAyOTM5LC0wLjgwMTI2IC0wLjExMTI5MywtMS41MTYzOSAtMC4xODM1OTMsLTIuMjQ4MDQgMS4zNjA4NTYsLTAuMDk3NiAyLjQzMTI0LC0wLjU1OTg2IDMuMTQ4NDM2LC0xLjI4OTA3IDAuNzgyNTk0LC0wLjc5NTcgMS4xOTM3ODEsLTEuODE4MTMgMS40MDgyMDMsLTIuODA2NjQgMC40Mjg4NDUsLTEuOTc3MDIgMC4wODc4OSwtMy44OTQ1MyAwLjA4Nzg5LC0zLjg5NDUzIGwgLTAuMDg1OTQsLTAuNDkyMTkgLTAuOTg0Mzc0LDAuMTY5OTMgMC4wODM5OCwwLjQ5NDE0IGMgMCwwIDAuMjk4MzkyLDEuNzczOTkgLTAuMDc4MTMsMy41MDk3NiAtMC4xODgyNTYsMC44Njc4OSAtMC41NDIwMjksMS43MDU3NyAtMS4xNDQ1MywyLjMxODM2IC0wLjU1Mjg2MSwwLjU2MjEyIC0xLjM2MDUxMywwLjkyNjM5IC0yLjUxNTYyNSwxLjAwMzkxIC0wLjYxMDM3OCwtNC43OTM2NyAtMi4wNTg5NTksLTguMDk0NzQgLTMuNTQ4ODI5LC0xMC4yMDUwOCAtMS44NzQyODEsLTIuNjU0ODUgLTMuNzk4ODI2LC0zLjU1NDY5IC0zLjc5ODgzLC0zLjU1NDY5IHoiCiAgICAgICAgIGlkPSJwYXRoMTAiIC8+PHBhdGgKICAgICAgICAgaWQ9ImxwZV9wYXRoLWVmZmVjdDEwIgogICAgICAgICBzdHlsZT0iYmFzZWxpbmUtc2hpZnQ6YmFzZWxpbmU7ZGlzcGxheTppbmxpbmU7b3ZlcmZsb3c6dmlzaWJsZTtvcGFjaXR5OjE7dmVjdG9yLWVmZmVjdDpub25lO2ZpbGw6I2ZmZmZmZjtzdHJva2Utd2lkdGg6MTtzdHJva2UtbGluZWNhcDpzcXVhcmU7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO2VuYWJsZS1iYWNrZ3JvdW5kOmFjY3VtdWxhdGU7c3RvcC1jb2xvcjojMDAwMDAwO3N0b3Atb3BhY2l0eToxIgogICAgICAgICBjbGFzcz0icG93ZXJjbGlwIgogICAgICAgICBkPSJtIDE4LjUyOTQ3NiwxMTMuODE3MSBoIDQyLjIxMjQ0MSB2IDQyLjIxMjQ0IEggMTguNTI5NDc2IFogbSAyMi4xNjU4MzQsNC4xMTI1OSAtMC40MTc5NjcsMC45MDgyIDAuNDU1MDc5LDAuMjA4OTkgYyAwLDAgMS42NDI0ODgsMC43NDAxMyAzLjM5NjQ4MiwzLjIyNDYgMS4zNzQyNTMsMS45NDY1OCAyLjc1NDc1OCw1LjAwNjExIDMuMzU5Mzc2LDkuNTQxMDIgLTMuMjQ1MTEyLC0wLjM3NjI3IC01LjY0OTE1MywtMi42MTc3NiAtOC43OTY4NzYsLTQuODk4NDQgYSAwLjUwMDA1LDAuNTAwMDUgMCAwIDAgLTAuMDAzOSwtMC4wMDIgYyAtNC41NTgwMDQsLTMuMjU5NjIgLTguMTIxNDcyLC00LjIwOTcyIC0xMC4zNzUsLTQuMjc1MzkgbCAtMC40OTk5OTksLTAuMDE1NiAtMC4wMjkzLDEgMC41LDAuMDE1NiBjIDIuMDAxNzkyLDAuMDU4MyA1LjM5MjM2MSwwLjkxODQ5IDkuODI0MjE5LDQuMDg3ODkgMy4xMjU3MTUsMi4yNjUyOSA1LjczOTM0OCw0Ljc2NjIgOS40NjQ4NDUsNS4xMDkzNyAwLjA3Nzk2LDAuNzU4MDYgMC4xNTkwMjEsMS41MDgwOCAwLjE4OTQ1MiwyLjM0NzY2IC02LjU0NjY5OSwwLjI2NzE4IC0xNC42MzA4NjUsMC4zMTEyNiAtMjQuNTQ0OTIxLC0wLjYyMTA5IGwgLTAuNDk4MDQ3LC0wLjA0NjkgLTAuMDkzNzUsMC45OTYxIDAuNDk4MDQ2LDAuMDQ2OSBjIDkuOTY1OTgyLDAuOTM3MjQgMTguMDg2NDQxLDAuODkyOTkgMjQuNjgxNjQsMC42MjMwNSAwLjAyMzYsMC45MzAzOCAtMC4wMzg2NywxLjc4NDE3IC0wLjEyMzA0NCwyLjYxNzE4IC0xLjY3MTMyNywwLjE3NDM3IC0zLjE0MTY2MiwwLjY5MTk4IC00LjUwMzkwOSwxLjUgLTEuNTg0MDIzLDAuOTM5NTggLTMuMTA0MTA3LDIuMTUwNTcgLTQuOTM5NDUyLDMuMzUxNTcgYSAwLjUwMDA1LDAuNTAwMDUgMCAwIDAgLTAuMDAyLDAuMDAyIGMgLTQuMzQzNzM0LDIuODc0MjYgLTcuNTc3NTE5LDIuNjg2NzUgLTkuNzQ4MDQ4LDIuNzUgbCAtMC40OTk5OTksMC4wMTM3IDAuMDI5MywxIDAuNSwtMC4wMTM3IGMgMi4wODQ0MTYsLTAuMDYwNyA1LjcxNDUzNSwwLjA5OTEgMTAuMjY5NTMxLC0yLjkxNDA2IGwgMC4wMDIsLTAuMDAyIGMgMS44Nzk0MSwtMS4yMzAwMiAzLjM5OTkzOSwtMi40MzkyNyA0Ljg5ODQzNywtMy4zMjgxMiAxLjIzMjc2MywtMC43MzEyMiAyLjQ4NzUwNiwtMS4xNjU0MiAzLjkwMDM5MSwtMS4zNDM3NSAtMS4xODYyMTksNy43MTA0IC02LjU0ODgyOCwxMC45NzA3IC02LjU0ODgyOCwxMC45NzA3IGwgLTAuNDI1NzgyLDAuMjU5NzcgMC41MjE0ODYsMC44NTM1MSAwLjQyNTc4MiwtMC4yNTk3NiBjIDAsMCA1Ljg4ODc3NSwtMy42Mzk3OCA3LjA3MDMxMSwtMTEuOTQzMzYgMS4xNzE0NDYsMC4wODA2IDEuOTY5NzU4LDAuNDE5ODIgMi41MDU4NiwwLjg5ODQ0IDAuNTY2MzQxLDAuNTA1NjEgMC44ODU3LDEuMTY3MjUgMS4wNTg1OTIsMS44NTU0NyAwLjM0NTc4OCwxLjM3NjQyIDAuMDY4MzYsMi43NzczNCAwLjA2ODM2LDIuNzc3MzQgbCAtMC4xMDE1NjMsMC40ODgyOCAwLjk3ODUxNiwwLjIwMzEzIDAuMTAxNTYxLC0wLjQ4ODI5IGMgMCwwIDAuMzM4NDEyLC0xLjU3MjM4IC0wLjA3NjE3LC0zLjIyMjY1IC0wLjIwNzI5MywtMC44MjUxNCAtMC42MTIwMTUsLTEuNjg4NjcgLTEuMzYzMjgzLC0yLjM1OTM4IC0wLjcxNTc5OSwtMC42MzkwNCAtMS43NTk0MzcsLTEuMDU5MzUgLTMuMTIzMDQ2LC0xLjE1MDM5IDAuMDc3ODksLTAuODIzNiAwLjE0ODY5OSwtMS42NTQ3MiAwLjEyNDk5OSwtMi41NjQ0NSAyLjQ1OTk2MSwtMC4xMTkwNCA1LjUzNzMyNSwtMC4xNjc5MiA3LjEyODkwNywtMC4zNTE1NiBsIDAuNDk4MDQ4LC0wLjA1NjYgLTAuMTE1MjM2LC0wLjk5NDE0IC0wLjQ5NjA5NCwwLjA1ODYgYyAtMS41NjAyODIsMC4xODAwMyAtNC42MjMyNywwLjIyODAxIC03LjA2MDU0NSwwLjM0NTcgLTAuMDI5MzksLTAuODAxMjYgLTAuMTExMjkzLC0xLjUxNjM5IC0wLjE4MzU5MywtMi4yNDgwNCAxLjM2MDg1NiwtMC4wOTc2IDIuNDMxMjQsLTAuNTU5ODYgMy4xNDg0MzYsLTEuMjg5MDcgMC43ODI1OTQsLTAuNzk1NyAxLjE5Mzc4MSwtMS44MTgxMyAxLjQwODIwMywtMi44MDY2NCAwLjQyODg0NSwtMS45NzcwMiAwLjA4Nzg5LC0zLjg5NDUzIDAuMDg3ODksLTMuODk0NTMgbCAtMC4wODU5NCwtMC40OTIxOSAtMC45ODQzNzQsMC4xNjk5MyAwLjA4Mzk4LDAuNDk0MTQgYyAwLDAgMC4yOTgzOTIsMS43NzM5OSAtMC4wNzgxMywzLjUwOTc2IC0wLjE4ODI1NiwwLjg2Nzg5IC0wLjU0MjAyOSwxLjcwNTc3IC0xLjE0NDUzLDIuMzE4MzYgLTAuNTUyODYxLDAuNTYyMTIgLTEuMzYwNTEzLDAuOTI2MzkgLTIuNTE1NjI1LDEuMDAzOTEgLTAuNjEwMzc4LC00Ljc5MzY3IC0yLjA1ODk1OSwtOC4wOTQ3NCAtMy41NDg4MjksLTEwLjIwNTA4IC0xLjg3NDI4MSwtMi42NTQ4NSAtMy43OTg4MjYsLTMuNTU0NjkgLTMuNzk4ODMsLTMuNTU0NjkgeiIgLz48L2NsaXBQYXRoPjwvZGVmcz48ZwogICAgIGlkPSJsYXllcjEiCiAgICAgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTE0LjIyMjA4MywtMTAuNzcwNjUpIj48ZwogICAgICAgaWQ9ImcxIj48cGF0aAogICAgICAgICBzdHlsZT0iZmlsbDojZmY3ZjUwO2ZpbGwtb3BhY2l0eToxO3N0cm9rZS13aWR0aDowLjI3Mjk3IgogICAgICAgICBpZD0icGF0aDEiCiAgICAgICAgIGNsaXAtcGF0aD0idXJsKCNjbGlwUGF0aDEwKSIKICAgICAgICAgdHJhbnNmb3JtPSJyb3RhdGUoMTQwLDU0LjY0NDg0Niw3OS4yMDYyODgpIgogICAgICAgICBkPSJtIDU1Ljc0MTkxNywxMzQuOTIzMzIgYSAxNi4xMDYyMiwxNi4xMDYyMiAwIDAgMSAtMTYuMTA2MjIxLDE2LjEwNjIyIDE2LjEwNjIyLDE2LjEwNjIyIDAgMCAxIC0xNi4xMDYyMiwtMTYuMTA2MjIgMTYuMTA2MjIsMTYuMTA2MjIgMCAwIDEgMTYuMTA2MjIsLTE2LjEwNjIyIDE2LjEwNjIyLDE2LjEwNjIyIDAgMCAxIDE2LjEwNjIyMSwxNi4xMDYyMiB6IiAvPjwvZz48L2c+PC9zdmc+Cg==";

  class ODE {
    getInfo() {
      return {
        id: "nishiowoOde",
        name: Scratch.translate("ODE"),
        blockIconURI: blockIconURI,
        color1: "#444444",
        menus: {
          bodyArrayType: {
            acceptReporters: false,
            items: ["position", "rotation", "quaternion", "force"],
          },
          bodyDampingType: {
            acceptReporters: false,
            items: ["angular damping", "linear damping"],
          },
          geomArrayType: {
            acceptReporters: false,
            items: ["position", "rotation", "quaternion"],
          },
          jointType: {
            acceptReporters: false,
            items: [
              "Ball-And-Socket",
              "Double Ball-And-Socket",
              "Double Hinge",
              "Fixed",
              "Hinge",
              "Hinge-2",
              "Linear Motor",
              "Piston",
              "Plane 2D",
              "Prismatic-Rotoride",
              "Prismatic-Universal",
              "Slider",
              "Transmission",
              "Universal",
            ],
          },
          jointArrayType: {
            acceptReporters: false,
            items: [
              "primary anchor",
              "secondary anchor",
              "primary axis",
              "secondary axis",
              "teritiary axis",
            ],
          },
          jointAngleType: {
            acceptReporters: false,
            items: ["primary angle", "secondary angle"],
          },
          placeable: {
            acceptReporters: false,
            items: ["placeable", "non-placeable"],
          },
          wrap: {
            acceptReporters: false,
            items: ["wrapping", "non-wrapping"],
          },
        },
        blocks: [
          {
            opcode: "resetAll",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("reset all"),
          },
          {
            blockType: "label",
            text: Scratch.translate("World"),
          },
          {
            opcode: "newWorld",
            blockType: Scratch.BlockType.REPORTER,
            disableMonitor: true,
            text: Scratch.translate("new world"),
          },
          {
            opcode: "worldDestroy",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("destroy world [WORLD]"),
            arguments: {
              WORLD: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
            },
          },
          {
            opcode: "worldStep",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate(
              "run steps for [SECOND] seconds in world [WORLD]"
            ),
            arguments: {
              SECOND: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: "1",
              },
              WORLD: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
            },
          },
          {
            opcode: "worldSetGravity",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate(
              "set gravity of world [WORLD] to [GRAVITY]"
            ),
            arguments: {
              WORLD: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
              GRAVITY: {
                type: arg_array,
                defaultValue: from_array([0, -9.81, 0]),
              },
            },
          },
          {
            opcode: "worldIsRaycastTouching",
            blockType: Scratch.BlockType.BOOLEAN,
            text: Scratch.translate(
              "is raycast from [START] to [END] in world [WORLD] touching any geometries"
            ),
            arguments: {
              WORLD: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
              START: {
                type: arg_array,
                defaultValue: from_array([0, 0, 0]),
              },
              END: {
                type: arg_array,
                defaultValue: from_array([0, 0, 0]),
              },
            },
          },
          {
            opcode: "worldIsRaycastTouchingGeom",
            blockType: Scratch.BlockType.BOOLEAN,
            text: Scratch.translate(
              "is raycast from [START] to [END] in world [WORLD] touching geometry [GEOM]"
            ),
            arguments: {
              WORLD: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
              START: {
                type: arg_array,
                defaultValue: from_array([0, 0, 0]),
              },
              END: {
                type: arg_array,
                defaultValue: from_array([0, 0, 0]),
              },
              GEOM: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
            },
          },
          {
            blockType: "label",
            text: Scratch.translate("Body"),
          },
          {
            opcode: "newBody",
            blockType: Scratch.BlockType.REPORTER,
            disableMonitor: true,
            text: Scratch.translate("new body in world [WORLD]"),
            arguments: {
              WORLD: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
            },
          },
          {
            opcode: "bodyDestroy",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate(
              "destroy body [BODY] and associated geometries/joints"
            ),
            arguments: {
              BODY: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
            },
          },
          {
            opcode: "bodyGetArray",
            blockType: blk_array,
            disableMonitor: true,
            text: Scratch.translate("get [TYPE] of body [BODY]"),
            arguments: {
              BODY: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
              TYPE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "position",
                menu: "bodyArrayType",
              },
            },
          },
          {
            opcode: "bodySetArray",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("set [TYPE] of body [BODY] to [ARRAY]"),
            arguments: {
              BODY: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
              TYPE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "position",
                menu: "bodyArrayType",
              },
              ARRAY: {
                type: arg_array,
                defaultValue: from_array([0, 0, 0]),
              },
            },
          },
          {
            opcode: "bodyAddForce",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("add force [FORCE] to body [BODY]"),
            arguments: {
              BODY: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
              FORCE: {
                type: arg_array,
                defaultValue: from_array([0, 0, 0]),
              },
            },
          },
          {
            opcode: "bodyGetDamping",
            blockType: Scratch.BlockType.REPORTER,
            disableMonitor: true,
            text: Scratch.translate("get [TYPE] of body [BODY]"),
            arguments: {
              BODY: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
              TYPE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "angular damping",
                menu: "bodyDampingType",
              },
            },
          },
          {
            opcode: "bodySetDamping",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("set [TYPE] of body [BODY] to [DAMP]"),
            arguments: {
              BODY: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
              DAMP: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0,
              },
              TYPE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "angular damping",
                menu: "bodyDampingType",
              },
            },
          },
          {
            opcode: "bodyIsKinematic",
            blockType: Scratch.BlockType.BOOLEAN,
            disableMonitor: true,
            text: Scratch.translate("is body [BODY] kinematic?"),
            arguments: {
              BODY: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
            },
          },
          {
            opcode: "bodySetKinematic",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("set body [BODY] to kinematic"),
            arguments: {
              BODY: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
            },
          },
          {
            opcode: "bodySetDynamic",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("set body [BODY] to dynamic"),
            arguments: {
              BODY: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
            },
          },
          {
            blockType: "label",
            text: Scratch.translate("Geometry"),
          },
          {
            opcode: "newGeomBox",
            blockType: Scratch.BlockType.REPORTER,
            disableMonitor: true,
            text: Scratch.translate(
              "new box geometry with size [SIZE] in world [WORLD]"
            ),
            arguments: {
              SIZE: {
                type: arg_array,
                defaultValue: from_array([1, 1, 1]),
              },
              WORLD: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
            },
          },
          {
            opcode: "newGeomCapsule",
            blockType: Scratch.BlockType.REPORTER,
            disableMonitor: true,
            text: Scratch.translate(
              "new capsule geometry with radius [RADIUS] and length [LENGTH] in world [WORLD]"
            ),
            arguments: {
              RADIUS: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1,
              },
              LENGTH: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1,
              },
              WORLD: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
            },
          },
          {
            opcode: "newGeomCylinder",
            blockType: Scratch.BlockType.REPORTER,
            disableMonitor: true,
            text: Scratch.translate(
              "new cylinder geometry with radius [RADIUS] and length [LENGTH] in world [WORLD]"
            ),
            arguments: {
              RADIUS: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1,
              },
              LENGTH: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1,
              },
              WORLD: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
            },
          },
          {
            opcode: "newGeomSphere",
            blockType: Scratch.BlockType.REPORTER,
            disableMonitor: true,
            text: Scratch.translate(
              "new sphere geometry with radius [RADIUS] in world [WORLD]"
            ),
            arguments: {
              RADIUS: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1,
              },
              WORLD: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
            },
          },
          {
            opcode: "newGeomPlane",
            blockType: Scratch.BlockType.REPORTER,
            disableMonitor: true,
            text: Scratch.translate(
              "new plane geometry with equation [A]x+[B]y+[C]+z=[D] in world [WORLD]"
            ),
            arguments: {
              A: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0,
              },
              B: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1,
              },
              C: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0,
              },
              D: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0,
              },
              WORLD: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
            },
          },
          {
            opcode: "newGeomTriMesh",
            blockType: Scratch.BlockType.REPORTER,
            disableMonitor: true,
            text: Scratch.translate(
              "new trimesh geometry with vertex list [VERTEX] and index list [INDEX] in world [WORLD]"
            ),
            arguments: {
              VERTEX: {
                type: arg_array,
                defaultValue: [],
              },
              INDEX: {
                type: arg_array,
                defaultValue: [],
              },
              WORLD: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
            },
          },
          {
            opcode: "newGeomHeightfield",
            blockType: Scratch.BlockType.REPORTER,
            disableMonitor: true,
            text: Scratch.translate(
              "new [PLACEABLE] [WRAP] heightfield geometry with data [DATA], width [WIDTH] with [WIDTH_SAMPLES] samples, height [HEIGHT] with [HEIGHT_SAMPLES] samples, scale [SCALE], offset [OFFSET], and thickness [THICKNESS] in world [WORLD]"
            ),
            arguments: {
              PLACEABLE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "placeable",
                menu: "placeable",
              },
              WRAP: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "wrapping",
                menu: "wrap",
              },
              DATA: {
                type: arg_array,
                defaultValue: [],
              },
              WIDTH: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1,
              },
              HEIGHT: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1,
              },
              WIDTH_SAMPLES: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 2,
              },
              HEIGHT_SAMPLES: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 2,
              },
              SCALE: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1,
              },
              OFFSET: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0,
              },
              THICKNESS: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1,
              },
              WORLD: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
            },
          },
          {
            opcode: "geomDestroy",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("destroy geometry [GEOM]"),
            arguments: {
              GEOM: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
            },
          },
          {
            opcode: "geomAssociateBody",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate(
              "associate geometry [GEOM] with body [BODY] with mass [MASS]"
            ),
            arguments: {
              BODY: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
              GEOM: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
              MASS: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1,
              },
            },
          },
          {
            opcode: "geomGetArray",
            blockType: blk_array,
            disableMonitor: true,
            text: Scratch.translate("get [TYPE] of geometry [GEOM]"),
            arguments: {
              GEOM: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
              TYPE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "position",
                menu: "geomArrayType",
              },
            },
          },
          {
            opcode: "geomSetArray",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("set [TYPE] of geometry [GEOM] to [ARRAY]"),
            arguments: {
              GEOM: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
              TYPE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "position",
                menu: "geomArrayType",
              },
              ARRAY: {
                type: arg_array,
                defaultValue: from_array([0, 0, 0]),
              },
            },
          },
          {
            blockType: "label",
            text: Scratch.translate("Joint"),
          },
          {
            opcode: "newJoint",
            blockType: Scratch.BlockType.REPORTER,
            disableMonitor: true,
            text: Scratch.translate(
              "new [JOINT] joint between body [BODY1] and body [BODY2]"
            ),
            arguments: {
              JOINT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "Ball-And-Socket",
                menu: "jointType",
              },
              BODY1: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
              BODY2: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
            },
          },
          {
            opcode: "jointDestroy",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("destroy joint [JOINT]"),
            arguments: {
              JOINT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
            },
          },
          {
            opcode: "jointGetArray",
            blockType: blk_array,
            disableMonitor: true,
            text: Scratch.translate("get [TYPE] of joint [JOINT]"),
            arguments: {
              JOINT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
              TYPE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "primary anchor",
                menu: "jointArrayType",
              },
            },
          },
          {
            opcode: "jointSetArray",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("set [TYPE] of joint [JOINT] to [ARRAY]"),
            arguments: {
              JOINT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
              ARRAY: {
                type: arg_array,
                defaultValue: from_array([0, 0, 0]),
              },
              TYPE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "primary anchor",
                menu: "jointArrayType",
              },
            },
          },
          {
            opcode: "jointGetAngle",
            blockType: Scratch.BlockType.REPORTER,
            disableMonitor: true,
            text: Scratch.translate("get [TYPE] of joint [JOINT]"),
            arguments: {
              JOINT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
              TYPE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "primary angle",
                menu: "jointAngleType",
              },
            },
          },
          {
            opcode: "jointSetAngle",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("set [TYPE] of joint [JOINT] to [ANGLE]"),
            arguments: {
              JOINT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
              ANGLE: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0,
              },
              TYPE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "primary angle",
                menu: "jointAngleType",
              },
            },
          },
          {
            opcode: "jointAddForce",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("add force [FORCE] to joint [JOINT]"),
            arguments: {
              JOINT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
              FORCE: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0,
              },
            },
          },
          {
            opcode: "jointAddTorque",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("add torque [TORQUE] to joint [JOINT]"),
            arguments: {
              JOINT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
              TORQUE: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0,
              },
            },
          },
          {
            opcode: "jointAddTorques",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("add torques [TORQUES] to joint [JOINT]"),
            arguments: {
              JOINT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
              TORQUES: {
                type: arg_array,
                defaultValue: [0],
              },
            },
          },
        ],
      };
    }

    resetAll() {
      for (let i in worlds) this.worldDestroy({ WORLD: i });
      worlds = {};

      dCloseODE();
      dInitODE2(0);
    }

    newWorld() {
      const key = new_obj_key(worlds);

      worlds[key] = {
        world: dWorldCreate(),
        space: dHashSpaceCreate(0),
        contactGroup: dJointGroupCreate(0),
      };

      dWorldSetGravity(
        worlds[key].world,
        0,
        -9.81,
        0
      ); /* same gravity as earth */

      return key;
    }

    worldDestroy(args) {
      const world = Scratch.Cast.toString(args.WORLD);

      if (!worlds[world]) return;

      geoms = obj_exclude(geoms, "world", world);
      bodies = obj_exclude(bodies, "world", world);
      joints = obj_exclude(joints, "world", world);

      dJointGroupDestroy(worlds[world].contactGroup);
      dSpaceDestroy(worlds[world].space);
      dWorldDestroy(worlds[world].world);
      delete worlds[world];
    }

    worldStep(args) {
      const world = Scratch.Cast.toString(args.WORLD);
      const sec = Scratch.Cast.toNumber(args.SECOND);

      if (!worlds[world]) return;

      dDoCollision(
        worlds[world].world,
        worlds[world].space,
        worlds[world].contactGroup
      );
      dWorldStep(worlds[world].world, sec);
      dJointGroupEmpty(worlds[world].contactGroup);
    }

    worldSetGravity(args) {
      const world = Scratch.Cast.toString(args.WORLD);
      const gravity = to_f32array(args.GRAVITY);

      if (!worlds[world] || gravity.length != 3) return;

      dWorldSetGravity(worlds[world].world, gravity[0], gravity[1], gravity[2]);
    }

    worldIsRaycastTouching(args) {
      const world = Scratch.Cast.toString(args.WORLD);
      const start = to_f32array(args.START);
      const end = to_f32array(args.END);

      if (!worlds[world] || start.length != 3 || end.length != 3) return false;

      return Scratch.Cast.toBoolean(
        dRaycast(
          worlds[world].space,
          start[0],
          start[1],
          start[2],
          end[0],
          end[1],
          end[2]
        )
      );
    }

    worldIsRaycastTouchingGeom(args) {
      const world = Scratch.Cast.toString(args.WORLD);
      const start = to_f32array(args.START);
      const end = to_f32array(args.END);
      const geom = Scratch.Cast.toString(args.GEOM);

      if (
        !worlds[world] ||
        start.length != 3 ||
        end.length != 3 ||
        !geoms[geom]
      )
        return false;

      return Scratch.Cast.toBoolean(
        dRaycastGeom(
          worlds[world].space,
          start[0],
          start[1],
          start[2],
          end[0],
          end[1],
          end[2],
          geoms[geom].geom
        )
      );
    }

    newBody(args) {
      const world = Scratch.Cast.toString(args.WORLD);

      if (!worlds[world]) return "";

      const key = new_obj_key(bodies);

      bodies[key] = {
        world: world,
        body: dBodyCreate(worlds[world].world),
        geoms: [],
      };

      return key;
    }

    bodyDestroy(args) {
      const body = Scratch.Cast.toString(args.BODY);

      if (!bodies[body]) return [];

      dBodyDestroy(bodies[body].body);

      for (let i of bodies[body].geoms) {
        dGeomCustomDestroy(geoms[i].geom);

        delete geoms[i];
      }

      for (let i of Object.keys(joints).filter((x) =>
        joints[x].bodies.includes(body)
      )) {
        this.jointDestroy({ JOINT: i });
      }

      let n = {};
      for (let i of Object.keys(joints)) {
        if (joints[i].bodies.includes(body)) continue;
        n[i] = joints[i];
      }
      joints = n;

      delete bodies[body];
    }

    _bodyGetPosition(args) {
      const body = Scratch.Cast.toString(args.BODY);

      if (!bodies[body]) return [];

      const c = f64_view(dBodyGetPosition(bodies[body].body));

      return from_array([c[0], c[1], c[2]]);
    }

    _bodySetPosition(args) {
      const body = Scratch.Cast.toString(args.BODY);
      const pos = [...to_f32array(args.POS)];

      if (!bodies[body] || pos.length != 3) return;

      dBodySetPosition(bodies[body].body, pos[0], pos[1], pos[2]);
    }

    _bodyGetRotation(args) {
      const body = Scratch.Cast.toString(args.BODY);

      if (!bodies[body]) return [];

      const ptr = dBodyGetQuaternion(bodies[body].body);
      const c = f64_view(ptr);

      let r = quaternion_to_euler(c);

      return from_array(r.slice(0, 3));
    }

    _bodySetRotation(args) {
      const body = Scratch.Cast.toString(args.BODY);
      const rot = [...to_f32array(args.ROT)];

      if (!bodies[body] || rot.length != 3) return;

      const ptr = Module._malloc(Module.HEAPF64.BYTES_PER_ELEMENT * 4);
      const c = euler_to_quaternion(rot);
      let arr = new Float64Array(c);

      Module.HEAPF64.set(arr, ptr / Module.HEAPF64.BYTES_PER_ELEMENT);

      dBodySetQuaternion(bodies[body].body, ptr);

      Module._free(ptr);
    }

    _bodyGetQuaternion(args) {
      const body = Scratch.Cast.toString(args.BODY);

      if (!bodies[body]) return [];

      const ptr = dBodyGetQuaternion(bodies[body].body);
      const c = f64_view(ptr);

      const r = [c[1], c[2], c[3], c[0]];

      return from_array(r);
    }

    _bodySetQuaternion(args) {
      const body = Scratch.Cast.toString(args.BODY);
      const quat = [...to_f32array(args.QUAT)];

      if (!bodies[body] || quat.length != 4) return;

      const ptr = Module._malloc(Module.HEAPF64.BYTES_PER_ELEMENT * 4);
      let arr = new Float64Array([quat[3], quat[0], quat[1], quat[2]]);

      Module.HEAPF64.set(arr, ptr / Module.HEAPF64.BYTES_PER_ELEMENT);

      dBodySetQuaternion(bodies[body].body, ptr);

      Module._free(ptr);
    }

    _bodyGetForce(args) {
      const body = Scratch.Cast.toString(args.BODY);

      if (!bodies[body]) return [];

      const c = f64_view(dBodyGetForce(bodies[body].body));

      return from_array([c[0], c[1], c[2]]);
    }

    _bodySetForce(args) {
      const body = Scratch.Cast.toString(args.BODY);
      const force = [...to_f32array(args.FORCE)];

      if (!bodies[body] || force.length != 3) return;

      dBodySetForce(bodies[body].body, force[0], force[1], force[2]);
    }

    bodyGetArray(args) {
      const type = Scratch.Cast.toString(args.TYPE);

      return this["_bodyGet" + bodygeom_menu_to_func(type)]({
        BODY: args.BODY,
      });
    }

    bodySetArray(args) {
      const type = Scratch.Cast.toString(args.TYPE);
      let v = { BODY: args.BODY };

      v[bodygeom_menu_to_field(type)] = args.ARRAY;

      this["_bodySet" + bodygeom_menu_to_func(type)](v);
    }

    bodyAddForce(args) {
      const body = Scratch.Cast.toString(args.BODY);
      const force = [...to_f32array(args.FORCE)];

      if (!bodies[body] || force.length != 3) return;

      dBodyAddForce(bodies[body].body, force[0], force[1], force[2]);
    }

    _bodyGetAngularDamping(args) {
      const body = Scratch.Cast.toString(args.BODY);

      if (!bodies[body]) return [];

      return dBodyGetAngularDamping(bodies[body].body);
    }

    _bodySetAngularDamping(args) {
      const body = Scratch.Cast.toString(args.BODY);
      const angdamp = Scratch.Cast.toNumber(args.ANGDAMP);

      if (!bodies[body]) return;

      dBodySetAngularDamping(bodies[body].body, angdamp);
    }

    _bodyGetLinearDamping(args) {
      const body = Scratch.Cast.toString(args.BODY);

      if (!bodies[body]) return [];

      return dBodyGetLinearDamping(bodies[body].body);
    }

    _bodySetLinearDamping(args) {
      const body = Scratch.Cast.toString(args.BODY);
      const lindamp = Scratch.Cast.toNumber(args.LINDAMP);

      if (!bodies[body]) return;

      dBodySetLinearDamping(bodies[body].body, lindamp);
    }

    bodyGetDamping(args) {
      const type = Scratch.Cast.toString(args.TYPE);

      return this[
        "_bodyGet" +
          (type == "linear damping" ? "Linear" : "Angular") +
          "Damping"
      ]({ BODY: args.BODY });
    }

    bodySetDamping(args) {
      const type = Scratch.Cast.toString(args.TYPE);
      let v = { BODY: args.BODY };

      v[type == "linear damping" ? "LINDAMP" : "ANGDAMP"] = args.DAMP;

      this[
        "_bodySet" +
          (type == "linear damping" ? "Linear" : "Angular") +
          "Damping"
      ](v);
    }

    bodyIsKinematic(args) {
      const body = Scratch.Cast.toString(args.BODY);

      if (!bodies[body]) return false;

      return Scratch.Cast.toBoolean(dBodyIsKinematic(bodies[body].body));
    }

    bodySetKinematic(args) {
      const body = Scratch.Cast.toString(args.BODY);

      if (!bodies[body]) return;

      dBodySetKinematic(bodies[body].body);
    }

    bodySetDynamic(args) {
      const body = Scratch.Cast.toString(args.BODY);

      if (!bodies[body]) return;

      dBodySetDynamic(bodies[body].body);
    }

    newGeomBox(args) {
      const sz = [...to_f32array(args.SIZE)].map((x) => Math.max(1, x));
      const world = Scratch.Cast.toString(args.WORLD);

      if (!worlds[world] || sz.length != 3) return "";

      const key = new_obj_key(geoms);

      geoms[key] = {
        world: world,
        geom: dCreateBox(worlds[world].space, sz[0], sz[1], sz[2]),
      };

      return key;
    }

    newGeomCapsule(args) {
      const r = Math.min(1, Scratch.Cast.toNumber(args.RADIUS));
      const len = Math.min(1, Scratch.Cast.toNumber(args.LENGTH));
      const world = Scratch.Cast.toString(args.WORLD);

      if (!worlds[world]) return "";

      const key = new_obj_key(geoms);

      geoms[key] = {
        world: world,
        geom: dCreateCapsule(worlds[world].space, r, len),
      };

      return key;
    }

    newGeomCylinder(args) {
      const r = Math.min(1, Scratch.Cast.toNumber(args.RADIUS));
      const len = Math.min(1, Scratch.Cast.toNumber(args.LENGTH));
      const world = Scratch.Cast.toString(args.WORLD);

      if (!worlds[world]) return "";

      const key = new_obj_key(geoms);

      geoms[key] = {
        world: world,
        geom: dCreateCylinder(worlds[world].space, r, len),
      };

      return key;
    }

    newGeomSphere(args) {
      const r = Math.min(1, Scratch.Cast.toNumber(args.RADIUS));
      const world = Scratch.Cast.toString(args.WORLD);

      if (!worlds[world]) return "";

      const key = new_obj_key(geoms);

      geoms[key] = {
        world: world,
        geom: dCreateSphere(worlds[world].space, r),
      };

      return key;
    }

    newGeomPlane(args) {
      const a = Math.min(1, Scratch.Cast.toNumber(args.A));
      const b = Math.min(1, Scratch.Cast.toNumber(args.B));
      const c = Math.min(1, Scratch.Cast.toNumber(args.C));
      const d = Math.min(1, Scratch.Cast.toNumber(args.D));
      const world = Scratch.Cast.toString(args.WORLD);

      if (!worlds[world]) return "";

      const key = new_obj_key(geoms);

      geoms[key] = {
        world: world,
        geom: dCreatePlane(worlds[world].space, a, b, c, d),
      };

      return key;
    }

    newGeomTriMesh(args) {
      const vertex = [...to_f32array(args.VERTEX)];
      const index = [...to_f32array(args.INDEX)];
      const world = Scratch.Cast.toString(args.WORLD);

      if (
        !worlds[world] ||
        vertex.length % 3 != 0 ||
        index.length % 3 != 0 ||
        index.length <= 0
      )
        return "";

      const key = new_obj_key(geoms);
      const v_ptr = Module._malloc(
        Module.HEAPF64.BYTES_PER_ELEMENT * vertex.length
      );
      const i_ptr = Module._malloc(
        Module.HEAPU32.BYTES_PER_ELEMENT * index.length
      );

      Module.HEAPF64.set(vertex, v_ptr / Module.HEAPF64.BYTES_PER_ELEMENT);
      Module.HEAPU32.set(index, i_ptr / Module.HEAPU32.BYTES_PER_ELEMENT);

      geoms[key] = {
        world: world,
        geom: dCustomCreateTriMesh(
          worlds[world].space,
          v_ptr,
          vertex.length / 3,
          i_ptr,
          index.length / 3
        ),
      };

      Module._free(i_ptr);
      Module._free(v_ptr);

      return key;
    }

    newGeomHeightfield(args) {
      const data = [...to_f32array(args.DATA)];
      const placeable = Scratch.Cast.toString(args.PLACEABLE);
      const width = Scratch.Cast.toNumber(args.WIDTH);
      const height = Scratch.Cast.toNumber(args.HEIGHT);
      const s_width = Scratch.Cast.toNumber(args.WIDTH_SAMPLES);
      const s_height = Scratch.Cast.toNumber(args.HEIGHT_SAMPLES);
      const scale = Scratch.Cast.toNumber(args.SCALE);
      const offset = Scratch.Cast.toNumber(args.OFFSET);
      const thickness = Scratch.Cast.toNumber(args.THICKNESS);
      const wrap = Scratch.Cast.toString(args.WRAP);
      const world = Scratch.Cast.toString(args.WORLD);

      if (
        !worlds[world] ||
        data.length != s_width * s_height ||
        s_width < 2 ||
        s_height < 2
      )
        return "";

      const key = new_obj_key(geoms);
      const d_ptr = Module._malloc(
        Module.HEAPF64.BYTES_PER_ELEMENT * data.length
      );

      Module.HEAPF64.set(data, d_ptr / Module.HEAPF64.BYTES_PER_ELEMENT);

      geoms[key] = {
        world: world,
        geom: dCustomCreateHeightfield(
          worlds[world].space,
          placeable == "placeable",
          d_ptr,
          width,
          height,
          s_width,
          s_height,
          scale,
          offset,
          thickness,
          wrap == "wrapping"
        ),
      };

      Module._free(d_ptr);

      return key;
    }

    geomDestroy(args) {
      const geom = Scratch.Cast.toString(args.GEOM);

      if (!geoms[geom]) return;

      dGeomCustomDestroy(geoms[geom].geom);

      if (geoms[geom].body) {
        const body = geoms[geom].body;

        if (bodies[body].geoms.length == 1) {
          this.bodyDestroy({ BODY: body });
        } else {
          bodies[body].geoms.splice(bodies[body].geoms.indexOf(geom), 1);

          dGeomCustomDestroy(geoms[geom].geom);
        }
      }

      delete geoms[geom];
    }

    geomAssociateBody(args) {
      const geom = Scratch.Cast.toString(args.GEOM);
      const body = Scratch.Cast.toString(args.BODY);
      const mass = Scratch.Cast.toNumber(args.MASS);

      if (!geoms[geom]) return "";
      if (!bodies[body]) return "";

      dGeomSetBody(geoms[geom].geom, bodies[body].body);
      geoms[geom].body = body;

      bodies[body].geoms.push(geom);

      dBodyInitMass(bodies[body].body, mass);
    }

    _geomGetPosition(args) {
      const geom = Scratch.Cast.toString(args.GEOM);

      if (!geoms[geom]) return [];

      const c = f64_view(dGeomGetPosition(geoms[geom].geom));

      return from_array([c[0], c[1], c[2]]);
    }

    _geomSetPosition(args) {
      const geom = Scratch.Cast.toString(args.GEOM);
      const pos = [...to_f32array(args.POS)];

      if (!geoms[geom] || pos.length != 3) return;

      dGeomSetPosition(geoms[geom].geom, pos[0], pos[1], pos[2]);
    }

    _geomGetRotation(args) {
      const geom = Scratch.Cast.toString(args.GEOM);

      if (!geoms[geom]) return [];

      const ptr = Module._malloc(Module.HEAPF64.BYTES_PER_ELEMENT * 4);
      dGeomGetQuaternion(geoms[geom].geom, ptr);

      const c = f64_view(ptr);

      let r = quaternion_to_euler(c);

      Module._free(ptr);

      return from_array([r[0], r[1], r[2]]);
    }

    _geomSetRotation(args) {
      const geom = Scratch.Cast.toString(args.GEOM);
      const rot = [...to_f32array(args.ROT)];

      if (!geoms[geom] || rot.length != 3) return;

      const ptr = Module._malloc(Module.HEAPF64.BYTES_PER_ELEMENT * 4);
      const c = euler_to_quaternion(rot);
      let arr = new Float64Array([c[0], c[1], c[2], c[3]]);

      Module.HEAPF64.set(arr, ptr / Module.HEAPF64.BYTES_PER_ELEMENT);

      dGeomSetQuaternion(geoms[geom].geom, ptr);

      Module._free(ptr);
    }

    _geomGetQuaternion(args) {
      const geom = Scratch.Cast.toString(args.GEOM);

      if (!geoms[geom]) return [];

      const ptr = Module._malloc(Module.HEAPF64.BYTES_PER_ELEMENT * 4);
      dGeomGetQuaternion(geoms[geom].geom, ptr);

      const c = f64_view(ptr);

      const r = [c[1], c[2], c[3], c[0]];

      Module._free(ptr);

      return from_array(r);
    }

    _geomSetQuaternion(args) {
      const geom = Scratch.Cast.toString(args.GEOM);
      const quat = [...to_f32array(args.QUAT)];

      if (!geoms[geom] || quat.length != 4) return;

      const ptr = Module._malloc(Module.HEAPF64.BYTES_PER_ELEMENT * 4);
      let arr = new Float64Array([quat[3], quat[0], quat[1], quat[2]]);

      Module.HEAPF64.set(arr, ptr / Module.HEAPF64.BYTES_PER_ELEMENT);

      dGeomSetQuaternion(geoms[geom].geom, ptr);

      Module._free(ptr);
    }

    geomGetArray(args) {
      const type = Scratch.Cast.toString(args.TYPE);

      return this["_geomGet" + bodygeom_menu_to_func(type)]({
        GEOM: args.GEOM,
      });
    }

    geomSetArray(args) {
      const type = Scratch.Cast.toString(args.TYPE);
      let v = { GEOM: args.GEOM };

      v[bodygeom_menu_to_field(type)] = args.ARRAY;

      this["_geomSet" + bodygeom_menu_to_func(type)](v);
    }

    newJoint(args) {
      const joint = Scratch.Cast.toString(args.JOINT);
      const body1 = Scratch.Cast.toString(args.BODY1);
      const body2 = Scratch.Cast.toString(args.BODY2);

      if (!bodies[body1] || !bodies[body2]) return;

      let m;
      switch (joint) {
        case "Ball-And-Socket":
          m = dJointCreateBall;
          break;
        case "Double Ball-And-Socket":
          m = dJointCreateDBall;
          break;
        case "Double Hinge":
          m = dJointCreateDHinge;
          break;
        case "Fixed":
          m = dJointCreateFixed;
          break;
        case "Hinge":
          m = dJointCreateHinge;
          break;
        case "Hinge-2":
          m = dJointCreateHinge2;
          break;
        case "Linear Motor":
          m = dJointCreateLMotor;
          break;
        case "Piston":
          m = dJointCreatePiston;
          break;
        case "Plane 2D":
          m = dJointCreatePlane2D;
          break;
        case "Prismatic-Rotoride":
          m = dJointCreatePR;
          break;
        case "Prismatic-Universal":
          m = dJointCreatePU;
          break;
        case "Slider":
          m = dJointCreateSlider;
          break;
        case "Transmission":
          m = dJointCreateTransmission;
          break;
        case "Universal":
          m = dJointCreateUniversal;
          break;
      }

      const key = new_obj_key(joints);

      joints[key] = {
        joint: m(worlds[bodies[body1].world].world, 0),
        world: bodies[body1].world,
        bodies: [body1, body2],
        type: m,
      };

      dJointAttach(joints[key].joint, bodies[body1].body, bodies[body2].body);

      return key;
    }

    jointDestroy(args) {
      const joint = Scratch.Cast.toString(args.JOINT);

      if (!joints[joint]) return;

      dJointDestroy(joints[joint].joint);

      delete joints[joint];
    }

    _jointGetPrimaryAnchor(args) {
      const joint = Scratch.Cast.toString(args.JOINT);

      if (!joints[joint]) return [];

      const ptr = Module._malloc(Module.HEAPF64.BYTES_PER_ELEMENT * 4);

      let m;
      switch (joints[joint].type) {
        case dJointCreateBall:
          m = dJointGetBallAnchor;
          break;
        case dJointCreateHinge:
          m = dJointGetHingeAnchor;
          break;
        case dJointCreateHinge2:
          m = dJointGetHinge2Anchor;
          break;
        case dJointCreatePiston:
          m = dJointGetPistonAnchor;
          break;
        case dJointCreateUniversal:
          m = dJointGetUniversalAnchor;
          break;
        case dJointCreatePR:
          m = dJointGetPRAnchor;
          break;
        case dJointCreatePU:
          m = dJointGetPUAnchor;
          break;
        case dJointCreateTransmission:
          m = dJointGetTransmissionAnchor1;
          break;
        case dJointCreateDBall:
          m = dJointGetDBallAnchor1;
          break;
        case dJointCreateDHinge:
          m = dJointGetDHingeAnchor1;
          break;
      }
      if (!m) return [];
      m(joints[joint].type, ptr);

      const c = f64_view(ptr);

      const r = [c[0], c[1], c[2]];

      Module._free(ptr);

      return from_array(r);
    }

    _jointSetPrimaryAnchor(args) {
      const joint = Scratch.Cast.toString(args.JOINT);
      const anchor = [...to_f32array(args.ANCHOR)];

      if (!joints[joint] || anchor.length != 3) return;

      let m;
      switch (joints[joint].type) {
        case dJointCreateBall:
          m = dJointSetBallAnchor;
          break;
        case dJointCreateHinge:
          m = dJointSetHingeAnchor;
          break;
        case dJointCreateHinge2:
          m = dJointSetHinge2Anchor;
          break;
        case dJointCreatePiston:
          m = dJointSetPistonAnchor;
          break;
        case dJointCreatePR:
          m = dJointSetPRAnchor;
          break;
        case dJointCreatePU:
          m = dJointSetPUAnchor;
          break;
        case dJointCreateTransmission:
          m = dJointSetTransmissionAnchor1;
          break;
        case dJointCreateDBall:
          m = dJointSetDBallAnchor1;
          break;
        case dJointCreateDHinge:
          m = dJointSetDHingeAnchor1;
          break;
        case dJointCreateUniversal:
          m = dJointSetUniversalAnchor;
          break;
      }
      if (!m) return;

      m(joints[joint].joint, anchor[0], anchor[1], anchor[2]);
    }

    _jointGetSecondaryAnchor(args) {
      const joint = Scratch.Cast.toString(args.JOINT);

      if (!joints[joint]) return [];

      const ptr = Module._malloc(Module.HEAPF64.BYTES_PER_ELEMENT * 4);

      let m;
      switch (joints[joint].type) {
        case dJointCreateBall:
          m = dJointGetBallAnchor2;
          break;
        case dJointCreateHinge:
          m = dJointGetHingeAnchor2;
          break;
        case dJointCreateHinge2:
          m = dJointGetHinge2Anchor2;
          break;
        case dJointCreatePiston:
          m = dJointGetPistonAnchor2;
          break;
        case dJointCreateUniversal:
          m = dJointGetUniversalAnchor2;
          break;
        case dJointCreateTransmission:
          m = dJointGetTransmissionAnchor2;
          break;
        case dJointCreateDBall:
          m = dJointGetDBallAnchor2;
          break;
        case dJointCreateDHinge:
          m = dJointGetDHingeAnchor2;
          break;
      }
      if (!m) return [];
      m(joints[joint].type, ptr);

      const c = f64_view(ptr);

      const r = [c[0], c[1], c[2]];

      Module._free(ptr);

      return from_array(r);
    }

    _jointSetSecondaryAnchor(args) {
      const joint = Scratch.Cast.toString(args.JOINT);
      const anchor = [...to_f32array(args.ANCHOR)];

      if (!joints[joint] || anchor.length != 3) return;

      let m;
      switch (joints[joint].type) {
        case dJointCreateBall:
          m = dJointSetBallAnchor2;
          break;
        case dJointCreateTransmission:
          m = dJointSetTransmissionAnchor2;
          break;
        case dJointCreateDBall:
          m = dJointSetDBallAnchor2;
          break;
        case dJointCreateDHinge:
          m = dJointSetDHingeAnchor2;
          break;
      }
      if (!m) return;

      m(joints[joint].joint, anchor[0], anchor[1], anchor[2]);
    }

    _jointGetPrimaryAxis(args) {
      const joint = Scratch.Cast.toString(args.JOINT);

      if (!joints[joint]) return [];

      const ptr = Module._malloc(Module.HEAPF64.BYTES_PER_ELEMENT * 4);

      let m;
      switch (joints[joint].type) {
        case dJointCreateHinge:
          m = dJointGetHingeAxis;
          break;
        case dJointCreateHinge2:
          m = dJointGetHinge2Axis1;
          break;
        case dJointCreateLMotor:
          m = dJointGetLMotorAxis;
          break;
        case dJointCreatePiston:
          m = dJointGetPistonAxis;
          break;
        case dJointCreateSlider:
          m = dJointGetSliderAxis;
          break;
        case dJointCreatePR:
          m = dJointGetPRAxis1;
          break;
        case dJointCreatePU:
          m = dJointGetPUAxis1;
          break;
        case dJointCreateTransmission:
          m = dJointGetTransmissionAxis1;
          break;
        case dJointCreateUniversal:
          m = dJointGetUniversalAxis1;
          break;
        case dJointCreateDHinge:
          m = dJointGetDHingeAxis;
          break;
      }
      if (!m) return [];
      m(joints[joint].type, ptr);

      const c = f64_view(ptr);

      const r = [c[0], c[1], c[2]];

      Module._free(ptr);

      return from_array(r);
    }

    _jointSetPrimaryAxis(args) {
      const joint = Scratch.Cast.toString(args.JOINT);
      const axis = [...to_f32array(args.AXIS)];

      if (!joints[joint] || axis.length != 3) return;

      let m;
      switch (joints[joint].type) {
        case dJointCreateHinge:
          m = dJointSetHingeAxis;
          break;
        case dJointCreateHinge2:
          m = dJointSetHinge2Axis1;
          break;
        case dJointCreateLMotor:
          m = dJointSetLMotorAxis;
          break;
        case dJointCreatePiston:
          m = dJointSetPistonAxis;
          break;
        case dJointCreateSlider:
          m = dJointSetSliderAxis;
          break;
        case dJointCreatePR:
          m = dJointSetPRAxis1;
          break;
        case dJointCreatePU:
          m = dJointSetPUAxis1;
          break;
        case dJointCreateTransmission:
          m = dJointSetTransmissionAxis1;
          break;
        case dJointCreateUniversal:
          m = dJointSetUniversalAxis1;
          break;
        case dJointCreateDHinge:
          m = dJointSetDHingeAxis;
          break;
      }
      if (!m) return;

      m(joints[joint].joint, axis[0], axis[1], axis[2]);
    }

    _jointGetSecondaryAxis(args) {
      const joint = Scratch.Cast.toString(args.JOINT);

      if (!joints[joint]) return [];

      const ptr = Module._malloc(Module.HEAPF64.BYTES_PER_ELEMENT * 4);

      let m;
      switch (joints[joint].type) {
        case dJointCreateHinge2:
          m = dJointGetHinge2Axis2;
          break;
        case dJointCreateUniversal:
          m = dJointGetUniversalAxis2;
          break;
        case dJointCreatePR:
          m = dJointGetPRAxis2;
          break;
        case dJointCreatePU:
          m = dJointGetPUAxis2;
          break;
        case dJointCreateTransmission:
          m = dJointGetTransmissionAxis2;
          break;
      }
      if (!m) return [];
      m(joints[joint].type, ptr);

      const c = f64_view(ptr);

      const r = [c[0], c[1], c[2]];

      Module._free(ptr);

      return from_array(r);
    }

    _jointSetSecondaryAxis(args) {
      const joint = Scratch.Cast.toString(args.JOINT);
      const axis = [...to_f32array(args.AXIS)];

      if (!joints[joint] || axis.length != 3) return;

      let m;
      switch (joints[joint].type) {
        case dJointCreateHinge2:
          m = dJointSetHinge2Axis2;
          break;
        case dJointCreateUniversal:
          m = dJointSetUniversalAxis2;
          break;
        case dJointCreatePR:
          m = dJointSetPRAxis2;
          break;
        case dJointCreatePU:
          m = dJointSetPUAxis2;
          break;
        case dJointCreateTransmission:
          m = dJointSetTransmissionAxis2;
          break;
      }
      if (!m) return;

      m(joints[joint].joint, axis[0], axis[1], axis[2]);
    }

    _jointGetTertiaryAxis(args) {
      const joint = Scratch.Cast.toString(args.JOINT);

      if (!joints[joint]) return [];

      const ptr = Module._malloc(Module.HEAPF64.BYTES_PER_ELEMENT * 4);

      let m;
      switch (joints[joint].type) {
        case dJointCreatePU:
          m = dJointGetPUAxis3;
          break;
      }
      if (!m) return [];
      m(joints[joint].type, ptr);

      const c = f64_view(ptr);

      const r = [c[0], c[1], c[2]];

      Module._free(ptr);

      return from_array(r);
    }

    _jointSetTertiaryAxis(args) {
      const joint = Scratch.Cast.toString(args.JOINT);
      const axis = [...to_f32array(args.AXIS)];

      if (!joints[joint] || axis.length != 3) return;

      let m;
      switch (joints[joint].type) {
        case dJointCreatePU:
          m = dJointSetPUAxis3;
          break;
      }
      if (!m) return;

      m(joints[joint].joint, axis[0], axis[1], axis[2]);
    }

    jointGetArray(args) {
      const type = Scratch.Cast.toString(args.TYPE);

      return this["_jointGet" + joint_menu_to_func(type)]({
        JOINT: args.JOINT,
      });
    }

    jointSetArray(args) {
      const type = Scratch.Cast.toString(args.TYPE);
      let v = { JOINT: args.JOINT };

      v[joint_menu_to_field(type)] = args.ARRAY;

      this["_jointSet" + joint_menu_to_func(type)](v);
    }

    _jointGetPrimaryAngle(args) {
      const joint = Scratch.Cast.toString(args.JOINT);

      if (!joints[joint]) return 0;

      let m;
      switch (joints[joint].type) {
        case dJointCreateHinge:
          m = dJointGetHingeAngle;
          break;
        case dJointCreateHinge2:
          m = dJointGetHinge2Angle1;
          break;
        case dJointCreatePiston:
          m = dJointGetPistonAngle;
          break;
        case dJointCreatePR:
          m = dJointGetPRAngle;
          break;
        case dJointCreatePU:
          m = dJointGetPUAngle1;
          break;
        case dJointCreateUniversal:
          m = dJointGetUniversalAngle1;
          break;
        case dJointCreateTransmission:
          m = dJointGetTransmissionAngle1;
          break;
      }
      if (!m) return 0;

      return m(joints[joint].type) * (180 / Math.PI);
    }

    _jointSetPrimaryAngle(args) {}

    _jointGetSecondaryAngle(args) {
      const joint = Scratch.Cast.toString(args.JOINT);

      if (!joints[joint]) return 0;

      let m;
      switch (joints[joint].type) {
        case dJointCreateHinge2:
          m = dJointGetHingeAngle2;
          break;
        case dJointCreateUniversal:
          m = dJointGetUniversalAngle2;
          break;
        case dJointCreatePU:
          m = dJointGetPUAngle2;
          break;
        case dJointCreateTransmission:
          m = dJointGetTransmissionAngle2;
          break;
      }
      if (!m) return 0;

      return m(joints[joint].type) * (180 / Math.PI);
    }

    _jointSetSecondaryAngle(args) {}

    jointGetAngle(args) {
      const type = Scratch.Cast.toString(args.TYPE);

      return this[
        "_jointGet" +
          (type == "primary angle" ? "Primary" : "Secondary") +
          "Angle"
      ]({ JOINT: args.JOINT });
    }

    jointSetAngle(args) {
      const type = Scratch.Cast.toString(args.TYPE);

      this[
        "_jointSet" +
          (type == "primary angle" ? "Primary" : "Secondary") +
          "Angle"
      ]({ JOINT: args.JOINT, ANGLE: args.ANGLE });
    }

    jointAddForce(args) {
      const joint = Scratch.Cast.toString(args.JOINT);
      const force = Scratch.Cast.toNumber(args.FORCE);

      if (!joints[joint]) return;

      let m;
      switch (joints[joint].type) {
        case dJointCreateSlider:
          m = dJointAddSliderForce;
          break;
        case dJointCreatePiston:
          m = dJointAddPistonForce;
          break;
      }
      if (!m) return;

      m(joints[joint].joint, force);
    }

    jointAddTorque(args) {
      const joint = Scratch.Cast.toString(args.JOINT);
      const torque = Scratch.Cast.toNumber(args.TORQUE);

      if (!joints[joint]) return;

      let m;
      switch (joints[joint].type) {
        case dJointCreateHinge:
          m = dJointAddHingeTorque;
          break;
        case dJointCreatePR:
          m = dJointAddPRTorque;
          break;
      }
      if (!m) return;

      m(joints[joint].joint, torque);
    }

    jointAddTorques(args) {
      const joint = Scratch.Cast.toString(args.JOINT);
      const torques = [...to_f32array(args.TORQUES)];

      if (!joints[joint]) return;

      if (torques.length == 1) {
        this.jointAddTorque({ JOINT: joint, TORQUE: torques[0] });
        return;
      }

      switch (joints[joint].type) {
        case dJointCreateHinge2:
          if (torques.length == 2)
            dJointAddHinge2Torques(joints[joint].joint, torques[0], torques[1]);
          break;
        case dJointCreateUniversal:
          if (torques.length == 2)
            dJointAddUniversalTorques(
              joints[joint].joint,
              torques[0],
              torques[1]
            );
          break;
        case dJointCreatePU:
          if (torques.length == 3)
            dJointAddPUTorques(joints[joint].joint, torques[0], torques[1]);
          break;
      }
    }
  }

  dInitODE2(0);

  Scratch.extensions.register(new ODE());
})(Scratch);
