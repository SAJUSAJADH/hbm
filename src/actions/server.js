'use server'

import Connect from "../dbconfig/connect"
import User from '../dbmodels/usermodel'
import Place from '../dbmodels/listing'
import Booking from '../dbmodels/bookings'
import { clerkClient } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import mongoose from "mongoose"
import { revalidatePath } from "next/cache"



export async function CheckAccuntStats(id) {
    await Connect()
    const account = await User.findOne({ userid: id })
    if (account) {
      return account.active
    }
    return false
  }



export const createOrupdateUser = async (name, bio, address, dateOfbirth, contactNumber, gender, email, userid) => {
    
    await Connect();
    const stat = await CheckAccuntStats(userid)
    if (stat === false) {
        redirect('/suspended')
        return
    } 
     let customer = await User.findOne({userid: userid})
     const params = { firstName: name};
     await clerkClient.users.updateUser(userid, params);
     if (customer) {
         customer = await User.findOneAndUpdate({userid: userid}, {
             $set: {
                email: email,
                name: name, 
                bio: bio, 
                address: address, 
                dateOfBirth: dateOfbirth, 
                contactNumber: contactNumber, 
                gender: gender
             }
         }, {new: true})
     }
 }

 export const selectRole = async (id, role) => {
    try {
        await User.create({
            userid: id,
            role: role
        }).then(()=>{
            redirect('/')
        })
    } catch (error) {
        console.log(error)
    }
 }


 export  const fetchUserInfo = async (userid) => {
    await Connect();
    console.log('hello')
    if (!userid) return
    console.log('hello2')
    let customer = await User.findOne({userid: userid})
    if (customer){
        return JSON.parse(JSON.stringify(customer))
    }else{
        return undefined
    }
    
 }

 export const addNewPlaceorUpdate  = async (placeData, id)=>{
    try {
        await Connect();
        const stat = await CheckAccuntStats(id)
        if (stat === false) {
            redirect('/suspended')
            return
        }
        const place = await Place.findById(id)
        if(place){
            const updatePlace = await Place.findByIdAndUpdate(id, placeData, { new: true})
            const updatedplaceid = (updatePlace._id).toString()
            return updatedplaceid
        }
        const newPlace = new Place(placeData)
        const savedPlace = await newPlace.save()
        const Savedid = (savedPlace._id).toString()
        return Savedid
    } catch (error) {
        return undefined
    }
 }


 export const fetchLisingsDetails = async (id) => {
    try {
        await Connect();
        const listings = await Place.findById(id)
        console.log(id)
        const {
                    _id,
                    owner,
                    title,
                    address,
                    photos,
                    description,
                    features,
                    extrainfo,
                    checkin,
                    checkout,
                    maxguest,
                    price,
        } = listings
        const { firstName, lastName, hasImage, imageUrl } = await clerkClient.users.getUser(owner)
        return {
            _id,
            owner,
            title,
            address,
            photos,
            description,
            features,
            extrainfo,
            checkin,
            checkout,
            maxguest,
            price,
            firstName, 
            lastName,
            hasImage,
            imageUrl
    }
    }catch(error){
        console.log(error)
    }
 }

 export const getAllListings= async (userid) => {
    await Connect();
    const stat = await CheckAccuntStats(userid)
        if (stat === false) {
            redirect('/suspended')
            return
        }
    const totalListings = await Place.find({owner: userid})
    return JSON.parse(JSON.stringify(totalListings))
 }

 export const getAllHotels= async () => {
    await Connect();
    const totalListings = await Place.find({})
    return JSON.parse(JSON.stringify(totalListings))
 }


 export const createBooking = async (formData) =>{
    try {
        await Connect()
        const stat = await CheckAccuntStats(formData.user)
        if (stat === false) {
            redirect('/suspended')
            return
        }
        const booking = new Booking(formData)
        const savedBooking = await booking.save();
        return JSON.parse(JSON.stringify(savedBooking))
    } catch (error) {
        console.log(error)
    }
 }

 export const getBooking = async (bookingid) =>{
    try {
        await Connect()
        const booking = await Booking.findById(bookingid)
        return JSON.parse(JSON.stringify(booking))
    } catch (error) {
        console.log(error)
    }
 }


 export const getAllbookings = async (userid) => {
    await Connect();
    const totalBookings = await Booking.find({user: userid})
    console.log(totalBookings)
    return JSON.parse(JSON.stringify(totalBookings))
 }

 
 export const cancelBooking = async (bookingid) => {
    await Connect();
    await Booking.findByIdAndDelete(bookingid)
    revalidatePath('/author')
    return
 }

 export const Search = async (query) => {
    await Connect();
    const filter = {
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { address: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } }
        ]
      };
    
      // Find all places that match the query
      const places = await Place.find(filter);

    return JSON.parse(JSON.stringify(places))
 }

 export async function suspendAccounts(identifier, repath) {
    await Connect()
    await User.findOneAndUpdate({ userid: identifier }, { active: false })
    revalidatePath(repath)
  }
  
  //enable account
  
  export async function EnableAccounts(identifier, repath) {
    await Connect()
    await User.findOneAndUpdate({ userid: identifier }, { active: true })
    revalidatePath(repath)
  }