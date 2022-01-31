package com.thoughtworks.bahmnidhis2integrationservice.controller;

import com.thoughtworks.bahmnidhis2integrationservice.util.SessionUtil;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.HashMap;
import java.util.Map;

@Controller
@RequestMapping("/api")
public class HomeController {

	@GetMapping(value = "/session")
	@ResponseBody
	public Map<String, String> sessionPrivileges() {
		return new HashMap<String, String>() {{
			put("user", SessionUtil.getUser());
			put("privileges", SessionUtil.getAvailablePrivileges().toString());
		}};
	}

}
