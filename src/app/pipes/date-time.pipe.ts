import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "dateTime",
})
export class DateTimePipe implements PipeTransform {
  transform(value: string): any {
    let format: any = value
      .toString()
      .match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [value];
    if (format.length > 1) {
      // If time format correct
      format = format.slice(1); // Remove full string match value
      format[5] = +format[0] < 12 ? "AM" : "PM"; // Set AM/PM
      format[0] = +format[0] % 12 || 12; // Adjust hours
    }
    return format.join(""); // return adjusted time or original string
  }
}
