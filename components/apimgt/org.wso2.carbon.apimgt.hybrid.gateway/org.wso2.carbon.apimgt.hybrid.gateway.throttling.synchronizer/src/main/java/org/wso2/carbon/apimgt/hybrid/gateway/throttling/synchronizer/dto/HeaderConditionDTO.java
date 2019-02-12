/*
 * Copyright (c) 2018 WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

package org.wso2.carbon.apimgt.hybrid.gateway.throttling.synchronizer.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;


@ApiModel(description = "")
public class HeaderConditionDTO extends ThrottleConditionDTO {

  private String headerName = null;

  private String headerValue = null;

  /**
   **/
  @ApiModelProperty(value = "")
  @JsonProperty("headerName")
  public String getHeaderName() {
    return headerName;
  }
  public void setHeaderName(String headerName) {
    this.headerName = headerName;
  }

  /**
   **/
  @ApiModelProperty(value = "")
  @JsonProperty("headerValue")
  public String getHeaderValue() {
    return headerValue;
  }
  public void setHeaderValue(String headerValue) {
    this.headerValue = headerValue;
  }

  @Override
  public String toString()  {
    StringBuilder sb = new StringBuilder();
    sb.append("class HeaderConditionDTO {\n");
    sb.append("  " + super.toString()).append("\n");
    sb.append("  headerName: ").append(headerName).append("\n");
    sb.append("  headerValue: ").append(headerValue).append("\n");
    sb.append("}\n");
    return sb.toString();
  }
}
