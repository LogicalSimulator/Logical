// https://gist.github.com/UnsignedArduino/e23b8329c3a786d1e4e99d8ee941436e

// Include this JavaScript file in an HTML file and it will add a DIV element to the bottom of the page which will contain console output and
// an textarea to run JavaScript code!
// Example script include tag: <script src="/on_page_console.js"></script>

// Set false to do nothing
const show_on_page_console = false;

// Code reviewed: https://codereview.stackexchange.com/a/275550/206220

if (show_on_page_console) {
  const where_to_add = document.body;
  const console_title = `On Page Console:`;
  const console_id = "console_out";
  const console_label = `Run JavaScript code: 
    (Remember that you can only run code in the context 
    of <a href="/on_page_console.js"><code>/on_page_console.js</code></a> - see 
    <a href="https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Content_scripts#using_eval_in_content_scripts">here</a>.)
  `;
  const script_id = "script_in";
  const text_area_style = "width: 100%; resize: vertical; -webkit-box-sizing: border-box; -moz-box-sizing: border-box; box-sizing: border-box;";
  
  function run_handler() {
    console.log(`Result: ${eval(document.getElementById(script_id).value)}`)
  }
  
  // https://stackoverflow.com/a/50773729/10291933

  function produce_text(name, args) {
    return args.reduce((output, arg) => {
      return output + (typeof arg === "object" && (JSON || {}).stringify ? JSON.stringify(arg) : arg) + "\n";
    }, "");
  }
  
  function rewire_logging_func(name) {
    let console_output = document.getElementById(console_id)
    console["old" + name] = console[name];
    console[name] = (...arguments) => {
      console_output.innerHTML += produce_text(name, arguments);
      console_output.scrollTop = console_output.scrollHeight;
      console["old" + name].apply(undefined, arguments);
    };
  }
  
  function rewire_logging() {
    rewire_logging_func("log");
    rewire_logging_func("debug");
    rewire_logging_func("warn");
    rewire_logging_func("error");
    rewire_logging_func("info");
  }
  
  window.onerror = (error_msg, url, line_number, col_number, error) => {
    let error_output;
    if (error.stack == null) {
      error_output = error_msg + "\n  URL: " + url + ":" + line_number + ":" + col_number;
    } else {
      error_output = error.stack;
    }
    console.error(error_output);
    return false;
  };
  
  const console_html = `
    <br><br>
    <div style="border:1px outset black; padding: 5px;">
      <b>${console_title}</b>
      <br>
      <textarea rows="10" cols="40" type="text" id="${console_id}" readonly style="${text_area_style}"></textarea>
      <br>
      <label for="${console_id}">${console_label}</label>
      <br>
      <textarea rows="10" cols="40" type="text" id="${script_id}" style="${text_area_style}"></textarea>
      <br>
      <button onclick="run_handler();">Run</button>
    </div>
  `;
  where_to_add.insertAdjacentHTML("beforeend", console_html);
  
  rewire_logging();
}
