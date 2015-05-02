/**
 * Copyright (c) 2015, betahikaru.
 * All rights reserved.
 * MIT
 */

#import "SettingBudleModule.h"

@implementation SettingBudleModule

RCT_EXPORT_MODULE();

// Example:
//   SettingBudleModule.readSetting(
//     'textAwsAccessKeyId',
//     'AWS Access Key ID',
//     (readValue) => {
//       console.log(readValue);
//     },
//     (errorMessage) => {
//       AlertIOS.alert('Error', errorMessage, [
//           {
//             text: 'OK',
//             onPress: () => {},
//           },
//         ]
//       );
//     }
//   );
RCT_EXPORT_METHOD(readSetting:(NSString *)key
                  name:(NSString *)name
                  callback:(RCTResponseSenderBlock)successCallback
                  errorCallback:(RCTResponseSenderBlock)failureCallback
                  )
{
  RCTLogInfo(@"Reading setting %@ value (%@)", key, name);
  NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
  if (defaults) {
    NSString *value = [defaults stringForKey:key];
    if (value == nil) {
      NSString *errorMessage = [NSString stringWithFormat:@"%@%@", @"Failed to read setting ", name];
      failureCallback(@[errorMessage]);
    } else if ([value isEqualToString:@""]) {
      NSString *errorMessage = [NSString stringWithFormat:@"%@%@%@", @"Required to set ", name, @" value in Settings.app"];
      failureCallback(@[errorMessage]);
    } else {
      successCallback(@[value]);
    }
  } else {
    failureCallback(@[@"Failed to load NSUserDefaults#standardUserDefaults"]);
  }
  RCTLogInfo(@"Finish to read setting %@ value (%@)", key, name);
}

// Example:
//   SettingBudleModule.readApiSetting(
//     (valueMap) => {
//       readSettingEmitter.emit('ReadSuccessEvent', valueMap);
//     },
//     (errorMessage) => {
//       readSettingEmitter.emit('ReadFailedEvent', errorMessage);
//     }
//   );
RCT_EXPORT_METHOD(readApiSetting:(RCTResponseSenderBlock)successCallback
                  errorCallback:(RCTResponseSenderBlock)failureCallback
                  )
{
  NSDictionary *keyNames = [NSDictionary dictionaryWithObjectsAndKeys:
                            @"AWS Access Key ID", @"textAwsAccessKeyId",
                            @"AWS Secret Access Key", @"textAwsSecretAccessKey",
                            nil];

  RCTLogInfo(@"Reading api setting values");
  NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
  if (defaults) {
    NSArray *keys = [keyNames allKeys];
    NSMutableDictionary *mutableValues = [[NSMutableDictionary alloc] init];
    NSMutableArray *mutableMessages = [[NSMutableArray alloc] init];
    for (NSString *key in keys) {
      RCTLogInfo(@"Reading key:%@", key);
      NSString *name = [keyNames objectForKey:key];
      NSString *value = [defaults stringForKey:key];
      if (value == nil) {
        NSString *errorMessage = [NSString stringWithFormat:@"%@%@", @"Failed to read setting ", name];
        [mutableMessages addObject:errorMessage];
      } else if ([value isEqualToString:@""]) {
        NSString *errorMessage = [NSString stringWithFormat:@"%@%@%@", @"Required to set ", name, @" value in Settings.app"];
        [mutableMessages addObject:errorMessage];
      } else {
        [mutableValues setObject:value forKey:key];
      }
    }
    if ([mutableMessages count] != 0) {
      RCTLogInfo(@"Failed to read api setting values");
      NSMutableString *combinedMessage = [[NSMutableString alloc] initWithString:@""];
      for (NSString *message in mutableMessages) {
        [combinedMessage appendString:message];
        [combinedMessage appendString:@"\n"];
      }
      failureCallback(@[combinedMessage]);
    } else {
      RCTLogInfo(@"Succeed to read api setting values");
      NSArray *values = [mutableValues copy];
      successCallback(@[values]);
    }
  } else {
    failureCallback(@[@"Failed to load NSUserDefaults#standardUserDefaults"]);
  }
  RCTLogInfo(@"Finish to read api setting values");
}

@end
