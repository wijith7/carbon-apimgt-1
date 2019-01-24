package org.wso2.carbon.apimgt.rest.api.publisher.dto;


import io.swagger.annotations.*;
import com.fasterxml.jackson.annotation.*;

import javax.validation.constraints.NotNull;





@ApiModel(description = "")
public class ConversionPolicyInfoDTO  {
  
  
  
  private String id = null;
  
  
  private String method = null;
  
  
  private String resourcePath = null;
  
  
  private String content = null;

  
  /**
   * UUID of the conversion policy registry artifact\n
   **/
  @ApiModelProperty(value = "UUID of the conversion policy registry artifact\n")
  @JsonProperty("id")
  public String getId() {
    return id;
  }
  public void setId(String id) {
    this.id = id;
  }

  
  /**
   * HTTP verb used for the resource path
   **/
  @ApiModelProperty(value = "HTTP verb used for the resource path")
  @JsonProperty("method")
  public String getMethod() {
    return method;
  }
  public void setMethod(String method) {
    this.method = method;
  }

  
  /**
   * A string that represents the resource path of the api for the related conversion policy
   **/
  @ApiModelProperty(value = "A string that represents the resource path of the api for the related conversion policy")
  @JsonProperty("resourcePath")
  public String getResourcePath() {
    return resourcePath;
  }
  public void setResourcePath(String resourcePath) {
    this.resourcePath = resourcePath;
  }

  
  /**
   * The conversion policy content
   **/
  @ApiModelProperty(value = "The conversion policy content")
  @JsonProperty("content")
  public String getContent() {
    return content;
  }
  public void setContent(String content) {
    this.content = content;
  }

  

  @Override
  public String toString()  {
    StringBuilder sb = new StringBuilder();
    sb.append("class ConversionPolicyInfoDTO {\n");
    
    sb.append("  id: ").append(id).append("\n");
    sb.append("  method: ").append(method).append("\n");
    sb.append("  resourcePath: ").append(resourcePath).append("\n");
    sb.append("  content: ").append(content).append("\n");
    sb.append("}\n");
    return sb.toString();
  }
}
