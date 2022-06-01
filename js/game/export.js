"use strict";

const pls_compress = true;

const component_indices = [
  AndGate,
  BufferGate,
  NandGate,
  NorGate,
  NotGate,
  OrGate,
  XnorGate,
  XorGate,
  FourBitDigit,
  EightBitDigit,
  Button,
  Clock,
  TrueConstant,
  FalseConstant,
  Light,
  Switch,
  Note,
];

function get_component_type(comp) {
  for (let i = 0; i < component_indices.length; i++) {
    if (comp instanceof component_indices[i]) {
      return i;
    }
  }
  return -1;
}

function get_component_index(comp, all_comps) {
  for (let i = 0; i < all_comps.length; i++) {
    if (comp === all_comps[i]) {
      return i;
    }
  }
  return undefined;
}

function get_component_from_id(id, all_comps) {
  for (let i = 0; i < all_comps.length; i++) {
    if (all_comps[i].id === id) {
      return all_comps[i];
    }
  }
  return undefined;
}

function get_component_output_connect_point_names(comp) {
  const points = [];
  for (let i = 1; ; i++) {
    const attr = "output" + i;
    if (comp[attr] != undefined) {
      points.push(attr);
    } else {
      break;
    }
  }
  return points;
}

function vector_to_json(vec) {
  return {
    x: vec.x,
    y: vec.y,
  };
}

function json_to_vector(json) {
  return createVector(json["x"], json["y"]);
}

function export_game(conns, conn_pts, comps) {
  let id = 0;
  for (const item of comps) {
    item.id = id;
    id++;
  }

  const json_comps = [];

  for (const comp of comps) {
    const json_conn_pts = {};

    const conn_out_pt_names = get_component_output_connect_point_names(comp);

    for (const name of conn_out_pt_names) {
      const json_out_conns = [];
      for (const conn of comp[name].connections) {
        if (conn == undefined) {
          continue;
        }
        const json_out_conn = {
          id: get_component_index(conn.to_point.parent, comps),
          name: conn.to_point.set_name.replace("_state", ""),
        };
        json_out_conns.push(json_out_conn);
      }
      json_conn_pts[name] = json_out_conns;
    }

    const json_comp = {
      id: comp.id,
      type: get_component_type(comp),
      pos: vector_to_json(comp.pos),
      angle: comp.angle,
      period: comp.period,
      delay: comp.delay,
      note_text: comp.note_text,
      out_connect_points: json_conn_pts,
    };
    json_comps.push(json_comp);
  }

  const json_state = {
    product: product,
    version: version,
    state: {
      components: json_comps,
      camera_x: camera.x,
      camera_y: camera.y,
    },
  };

  let full_json = JSON.stringify(json_state);
  console.log(json_state);
  if (pls_compress) {
    full_json = zip(full_json);
  }

  return full_json;
}

function import_game(s) {
  if (s[0] !== "{") {
    s = unzip(s);
  }

  const json_obj = JSON.parse(s);

  if (json_obj["product"] !== product) {
    console.error(
      "Incorrect product: " + json_obj["product"] + " != " + product
    );
    return;
  }
  if (json_obj["version"] !== version) {
    console.warn(
      "Different version: " + json_obj["version"] + " != " + version
    );
  }
  const json_state = json_obj["state"];
  const json_comps = json_state["components"];

  const connections = [];
  const connection_points = [];
  const components = [];

  for (const json_comp of json_comps) {
    const new_comp = new component_indices[json_comp["type"]](
      json_to_vector(json_comp["pos"])
    );
    new_comp.id = json_comp["id"];
    new_comp.angle = json_comp["angle"];
    new_comp.period = json_comp["period"];
    new_comp.delay = json_comp["delay"];
    new_comp.note_text = json_comp["note_text"];
    components.push(new_comp);
  }

  for (const json_comp of json_comps) {
    const json_from_id = json_comp["id"];
    const json_out_points = json_comp["out_connect_points"];
    for (const json_out_point of Object.keys(json_out_points)) {
      const json_from = json_out_point;
      const json_tos = json_out_points[json_from];
      for (const json_to of json_tos) {
        const json_to_id = json_to["id"];
        const json_to_point = json_to["name"];
        const from_comp = get_component_from_id(json_from_id, components);
        const to_comp = get_component_from_id(json_to_id, components);
        connections.push(
          make_connection(from_comp[json_from], to_comp[json_to_point])
        );
      }
    }
  }

  return {
    connections: connections,
    connection_points: connection_points,
    components: components,
  };
}
